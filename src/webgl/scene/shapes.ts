/**
 * The hero scene's shapes as point targets. Pure and seeded: the same seed
 * always yields the same Float32Arrays, so any renderer (particles today,
 * line-art or dither later) can draw the same scene.
 */
import { createRng, gaussian, type Rng } from "./random";

type Vec3 = [number, number, number];

export interface ShapeTargets {
  /** xyz per point. */
  positions: Float32Array;
  /** Shading per point, 0..1 (face light, edge emphasis, node vs arc). */
  brightness: Float32Array;
}

function rotate(p: Vec3, axis: "x" | "y" | "z", angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const [x, y, z] = p;
  if (axis === "x") return [x, c * y - s * z, s * y + c * z];
  if (axis === "y") return [c * x + s * z, y, -s * x + c * z];
  return [c * x - s * y, s * x + c * y, z];
}

function write(target: ShapeTargets, i: number, p: Vec3, b: number) {
  target.positions[i * 3] = p[0];
  target.positions[i * 3 + 1] = p[1];
  target.positions[i * 3 + 2] = p[2];
  target.brightness[i] = b;
}

const createTargets = (count: number): ShapeTargets => ({
  positions: new Float32Array(count * 3),
  brightness: new Float32Array(count),
});

/** Cells removed from the 3×3×3 mark, as "x,y,z" (the killed pixels). */
const KILLED_VOXELS = new Set(["2,2,2", "0,2,1", "2,0,1", "1,1,2"]);

/** The Pixelkiller mark: a 3×3×3 voxel cube with four cells killed, seen isometrically. */
export function voxelCube(count: number, rng: Rng): ShapeTargets {
  const size = 0.4;
  const half = size / 2 - 0.034;
  const has = (i: number, j: number, k: number) =>
    i >= 0 && i < 3 && j >= 0 && j < 3 && k >= 0 && k < 3 && !KILLED_VOXELS.has(`${i},${j},${k}`);

  // Faces visible from the isometric view (+x, +y, +z) that are not covered by a neighbour.
  const directions: [number, number, number, number][] = [
    [1, 0, 0, 0.62],
    [0, 1, 0, 1.0],
    [0, 0, 1, 0.82],
  ];
  const faces: { c: Vec3; u: Vec3; v: Vec3; b: number }[] = [];
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++) {
        if (!has(i, j, k)) continue;
        for (const [dx, dy, dz, b] of directions) {
          if (has(i + dx, j + dy, k + dz)) continue;
          faces.push({
            c: [(i - 1) * size + (dx * size) / 2, (j - 1) * size + (dy * size) / 2, (k - 1) * size + (dz * size) / 2],
            u: dx ? [0, 1, 0] : [1, 0, 0],
            v: dz ? [0, 1, 0] : [0, 0, 1],
            b,
          });
        }
      }

  const isoY = -Math.PI / 4;
  const isoX = Math.atan(1 / Math.SQRT2);
  const out = createTargets(count);
  for (let n = 0; n < count; n++) {
    const face = faces[Math.floor(rng() * faces.length)];
    const edge = rng() < 0.3;
    let a: number;
    let b: number;
    if (edge) {
      const side = Math.floor(rng() * 4);
      const t = (rng() * 2 - 1) * half;
      a = side < 2 ? (side ? half : -half) : t;
      b = side < 2 ? t : side === 2 ? half : -half;
    } else {
      a = (rng() * 2 - 1) * half;
      b = (rng() * 2 - 1) * half;
    }
    const p: Vec3 = [
      face.c[0] + face.u[0] * a + face.v[0] * b,
      face.c[1] + face.u[1] * a + face.v[1] * b,
      face.c[2] + face.u[2] * a + face.v[2] * b,
    ];
    write(out, n, rotate(rotate(p, "y", isoY), "x", isoX), Math.min(1, face.b + (edge ? 0.2 : 0)));
  }
  return out;
}

/**
 * A screen of pixels: a dim grid, a bezel, and lit cells that are the mark's
 * projection snapped to the grid, so the pixel art pops out into the 3D mark.
 */
export function pixelScreen(mark: ShapeTargets, rng: Rng): ShapeTargets {
  const count = mark.brightness.length;
  const width = 3.52;
  const height = 2.2;
  const cols = 160;
  const rows = 100;
  const px = width / (cols - 1);
  const py = height / (rows - 1);
  const background = Math.min(cols * rows, count);
  const bezel = Math.min(1400, count - background);

  const out = createTargets(count);
  for (let n = 0; n < count; n++) {
    let gx: number;
    let gy: number;
    let b: number;
    if (n < background) {
      gx = n % cols;
      gy = Math.floor(n / cols);
      b = 0.075;
    } else if (n < background + bezel) {
      const s = rng() * 2 * (cols + rows);
      if (s < cols) [gx, gy] = [Math.floor(s), -4];
      else if (s < 2 * cols) [gx, gy] = [Math.floor(s - cols), rows + 3];
      else if (s < 2 * cols + rows) [gx, gy] = [-4, Math.floor(s - 2 * cols)];
      else [gx, gy] = [cols + 3, Math.floor(s - 2 * cols - rows)];
      b = 0.4;
    } else {
      gx = Math.round((mark.positions[n * 3] + width / 2) / px);
      gy = Math.round((mark.positions[n * 3 + 1] + height / 2) / py);
      b = mark.brightness[n] * 0.9;
    }
    write(out, n, [gx * px - width / 2, gy * py - height / 2, 0], b);
  }
  return out;
}

/** A lathe-turned shaft: a surface of revolution, machined edges as rings, a dashed centre line. */
export function shaft(count: number, rng: Rng): ShapeTargets {
  // Profile as (x, radius): journal, shoulder, body with a groove, chamfered step, neck.
  const profile: [number, number][] = [
    [-1.3, 0], [-1.3, 0.26], [-1.26, 0.3], [-0.95, 0.3], [-0.95, 0.44], [-0.62, 0.44],
    [-0.62, 0.52], [-0.2, 0.52], [-0.2, 0.45], [-0.08, 0.45], [-0.08, 0.52], [0.42, 0.52],
    [0.46, 0.48], [0.46, 0.38], [0.8, 0.38], [0.8, 0.24], [1.26, 0.24], [1.3, 0.2], [1.3, 0],
  ];
  const segments: { x1: number; r1: number; x2: number; r2: number; nx: number; nr: number; acc: number }[] = [];
  let total = 0;
  for (let i = 0; i < profile.length - 1; i++) {
    const [x1, r1] = profile[i];
    const [x2, r2] = profile[i + 1];
    const length = Math.hypot(x2 - x1, r2 - r1);
    total += Math.PI * (r1 + r2) * length;
    segments.push({ x1, r1, x2, r2, nx: -(r2 - r1) / length, nr: (x2 - x1) / length, acc: total });
  }
  const rings = profile.filter(([, r]) => r > 0.05);
  const orient = (p: Vec3) => rotate(rotate(rotate(p, "z", 0.3), "y", -0.6), "x", 0.18);
  const lightRaw: Vec3 = [-0.35, 0.8, 0.5];
  const lightLength = Math.hypot(...lightRaw);
  const light = lightRaw.map((c) => c / lightLength) as Vec3;

  const out = createTargets(count);
  for (let n = 0; n < count; n++) {
    const r = rng();
    let p: Vec3 = [0, 0, 0];
    let b = 0.5;
    if (r < 0.74) {
      // Lateral surface, biased to faces turned towards the camera.
      for (let tries = 0; tries < 8; tries++) {
        const q = rng() * total;
        const s = segments.find((seg) => q <= seg.acc) ?? segments[segments.length - 1];
        const t = rng();
        const x = s.x1 + (s.x2 - s.x1) * t;
        const radius = s.r1 + (s.r2 - s.r1) * t;
        const theta = rng() * 2 * Math.PI;
        const normal = orient([s.nx, s.nr * Math.cos(theta), s.nr * Math.sin(theta)]);
        p = orient([x, radius * Math.cos(theta), radius * Math.sin(theta)]);
        b = 0.16 + 0.84 * Math.max(0, normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2]);
        if (normal[2] > -0.2) break;
      }
    } else if (r < 0.95) {
      const [x, radius] = rings[Math.floor(rng() * rings.length)];
      const theta = rng() * 2 * Math.PI;
      p = orient([x, radius * Math.cos(theta), radius * Math.sin(theta)]);
      b = 0.95;
    } else {
      let x = 0;
      for (let tries = 0; tries < 20; tries++) {
        x = rng() * 3.4 - 1.7;
        if (x * 5 - Math.floor(x * 5) < 0.55) break;
      }
      p = orient([x, 0, 0]);
      b = 0.45;
    }
    write(out, n, p, b);
  }
  return out;
}

/** Ventures as a constellation: node clusters on a sphere, joined by arcs to their nearest neighbours. */
export function network(count: number, rng: Rng): ShapeTargets {
  const nodeCount = 26;
  const radius = 1.16;
  const nodes: { v: Vec3; w: number }[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - ((i + 0.5) / nodeCount) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = i * 2.399963 + 0.4;
    const v: Vec3 = [
      Math.cos(theta) * ring + gaussian(rng) * 0.06,
      y + gaussian(rng) * 0.06,
      Math.sin(theta) * ring + gaussian(rng) * 0.06,
    ];
    const m = Math.hypot(...v);
    nodes.push({ v: [v[0] / m, v[1] / m, v[2] / m], w: i % 9 === 0 ? 2.6 : 0.6 + rng() * 0.8 });
  }

  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodeCount; i++) {
    const nearest = nodes
      .map((node, k) => [k, Math.hypot(node.v[0] - nodes[i].v[0], node.v[1] - nodes[i].v[1], node.v[2] - nodes[i].v[2])])
      .filter(([k]) => k !== i)
      .sort((a, b) => a[1] - b[1]);
    for (let q = 0; q < 3; q++) {
      const k = nearest[q][0];
      const key = `${Math.min(i, k)}-${Math.max(i, k)}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push([i, k]);
      }
    }
  }

  const weightSum = nodes.reduce((sum, node) => sum + node.w, 0);
  const orient = (p: Vec3) => rotate(rotate(p, "x", 0.35), "y", 0.2);
  const out = createTargets(count);
  for (let n = 0; n < count; n++) {
    let p: Vec3;
    let b: number;
    if (rng() < 0.3) {
      let q = rng() * weightSum;
      let node = nodes[0];
      for (const candidate of nodes) {
        q -= candidate.w;
        if (q <= 0) {
          node = candidate;
          break;
        }
      }
      const spread = 0.028 * Math.sqrt(node.w);
      p = [
        node.v[0] * radius + gaussian(rng) * spread,
        node.v[1] * radius + gaussian(rng) * spread,
        node.v[2] * radius + gaussian(rng) * spread,
      ];
      b = 1;
    } else {
      const [ia, ib] = edges[Math.floor(rng() * edges.length)];
      const A = nodes[ia].v;
      const B = nodes[ib].v;
      const t = rng();
      const omega = Math.acos(Math.min(1, Math.max(-1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2])));
      const so = Math.sin(omega) || 1e-6;
      const ka = Math.sin((1 - t) * omega) / so;
      const kb = Math.sin(t * omega) / so;
      const lift = radius * (1 + 0.07 * Math.sin(Math.PI * t));
      p = [
        (A[0] * ka + B[0] * kb) * lift + gaussian(rng) * 0.004,
        (A[1] * ka + B[1] * kb) * lift + gaussian(rng) * 0.004,
        (A[2] * ka + B[2] * kb) * lift + gaussian(rng) * 0.004,
      ];
      b = 0.34 + 0.14 * rng();
    }
    write(out, n, orient(p), b);
  }
  return out;
}

/** Floats per point in MorphScene.data. */
export const MORPH_STRIDE = 20;

/**
 * Interleaved morph targets, per point:
 * pixels xyz, mark xyz, shaft xyz, network xyz (12) · brightness ×4 (4) ·
 * delay, size, accent flag, twinkle phase (4).
 */
export interface MorphScene {
  count: number;
  data: Float32Array;
}

export function buildMorphScene(count: number, seed: number): MorphScene {
  const rng = createRng(seed);
  const mark = voxelCube(count, rng);
  const pixels = pixelScreen(mark, rng);
  const part = shaft(count, rng);
  const net = network(count, rng);

  // Rank-match the shaft and the network to the mark by screen angle, so a
  // morph sweeps around the centre instead of every point crossing the frame.
  const order = (t: ShapeTargets) => {
    const key = new Float32Array(count);
    const index = new Array<number>(count);
    for (let i = 0; i < count; i++) {
      key[i] = Math.atan2(t.positions[i * 3 + 1], t.positions[i * 3]) + 0.05 * (rng() - 0.5);
      index[i] = i;
    }
    return index.sort((a, b) => key[a] - key[b]);
  };
  const byMark = order(mark);
  const byPart = order(part);
  const byNet = order(net);
  const partOf = new Uint32Array(count);
  const netOf = new Uint32Array(count);
  for (let k = 0; k < count; k++) {
    partOf[byMark[k]] = byPart[k];
    netOf[byMark[k]] = byNet[k];
  }

  const data = new Float32Array(count * MORPH_STRIDE);
  const copy = (o: number, t: ShapeTargets, i: number) => {
    data[o] = t.positions[i * 3];
    data[o + 1] = t.positions[i * 3 + 1];
    data[o + 2] = t.positions[i * 3 + 2];
  };
  for (let n = 0; n < count; n++) {
    const o = n * MORPH_STRIDE;
    const pi = partOf[n];
    const ni = netOf[n];
    copy(o, pixels, n);
    copy(o + 3, mark, n);
    copy(o + 6, part, pi);
    copy(o + 9, net, ni);
    data[o + 12] = pixels.brightness[n];
    data[o + 13] = mark.brightness[n];
    data[o + 14] = part.brightness[pi];
    data[o + 15] = net.brightness[ni];
    // Delay grows from the centre outwards, so morphs bloom.
    data[o + 16] = 0.6 * Math.min(1, Math.hypot(mark.positions[n * 3], mark.positions[n * 3 + 1]) / 1.05) + 0.4 * rng();
    data[o + 17] = rng() < 0.015 ? 2 : 0.7 + 0.6 * rng();
    data[o + 18] = rng() < 0.06 ? 1 : 0;
    data[o + 19] = rng();
  }
  return { count, data };
}
