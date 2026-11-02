/**
 * Hero renderer for the Signal theme: 48k additive points morphing through the
 * scene's four shapes (pixels → mark → part → network), with pointer
 * repulsion, scroll dispersion and a quiet zone behind the headline.
 */
import { SIMPLEX_NOISE_3D, SOFT_POINT_FRAGMENT } from "../glsl/chunks";
import { linkProgram, uniformLocations } from "../core/program";
import { createStage, type Stage } from "../core/stage";
import type { NdcRect, SceneRenderer } from "../core/types";
import { buildMorphScene, MORPH_STRIDE, type MorphScene } from "../scene/shapes";

export const PARTICLE_COUNT = 48_000;
const SEED = 20040611;

/** Seconds each shape holds, then morphs into the next. */
const HOLD = 3.6;
const TRANSITION = 2.6;
const PERIOD = HOLD + TRANSITION;
const PHASES = 4;
/** Shape shown as the still frame under reduced motion: the mark. */
const STILL_PHASE = 1;
const CAMERA_Z = 4.6;
/** Pointer response rate (1/s): about 7% per frame at 60 Hz, at any refresh rate. */
const POINTER_RATE = 4.35;

let sceneCache: MorphScene | null = null;
const morphScene = () => (sceneCache ??= buildMorphScene(PARTICLE_COUNT, SEED));

const VERTEX = /* glsl */ `#version 300 es
precision highp float;
layout(location=0) in vec3 aP0;
layout(location=1) in vec3 aP1;
layout(location=2) in vec3 aP2;
layout(location=3) in vec3 aP3;
layout(location=4) in vec4 aB;
layout(location=5) in vec4 aR;
uniform mat4 uProj;
uniform float uCamZ, uTime, uProg, uScatter, uMouseK, uAspect, uDpr, uScale, uSize, uRotY, uRotX;
uniform int uFrom, uTo;
uniform vec2 uMouse, uOffset;
uniform vec4 uSafe;
uniform vec3 uInk, uAccent;
out vec3 vCol;
out float vA;
${SIMPLEX_NOISE_3D}
vec3 shape(int k){
  if (k == 0) {
    vec3 q = aP0;
    q.z += 0.045 * sin(aP0.x * 2.6 + uTime * 1.3) * cos(aP0.y * 2.1 - uTime * 0.9);
    return q;
  }
  if (k == 1) return aP1;
  if (k == 2) return aP2;
  return aP3;
}
float bright(int k){ return k == 0 ? aB.x : (k == 1 ? aB.y : (k == 2 ? aB.z : aB.w)); }
void main(){
  float lp = clamp((uProg - aR.x * 0.45) / 0.55, 0.0, 1.0);
  lp = lp * lp * (3.0 - 2.0 * lp);
  vec3 p = mix(shape(uFrom), shape(uTo), lp);
  float turb = sin(3.14159265 * lp);
  vec3 q = p * 1.35 + vec3(0.0, 0.0, uTime * 0.12);
  vec3 nz = vec3(snoise(q), snoise(q + 17.17), snoise(q + 31.31));
  p += nz * (0.38 * turb + 0.012 + uScatter * 1.4);
  float cy = cos(uRotY), sy = sin(uRotY), cx = cos(uRotX), sx = sin(uRotX);
  p = vec3(cy * p.x + sy * p.z, p.y, -sy * p.x + cy * p.z);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  p *= uScale;
  vec4 clip = uProj * vec4(p.x, p.y, p.z - uCamZ, 1.0);
  clip.xy += uOffset * clip.w;
  vec2 ndc = clip.xy / clip.w;
  vec2 d = ndc - uMouse;
  d.x *= uAspect;
  float dist = length(d);
  float fall = uMouseK * (1.0 - smoothstep(0.0, 0.34, dist));
  vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
  dir.x /= uAspect;
  ndc += dir * fall * 0.11;
  gl_Position = vec4(ndc * clip.w, clip.z, clip.w);
  float ex = 0.07, ey = 0.09;
  float sx2 = smoothstep(uSafe.x - ex, uSafe.x + ex, ndc.x) * (1.0 - smoothstep(uSafe.z - ex, uSafe.z + ex, ndc.x));
  float sy2 = smoothstep(uSafe.y - ey, uSafe.y + ey, ndc.y) * (1.0 - smoothstep(uSafe.w - ey, uSafe.w + ey, ndc.y));
  float b = mix(bright(uFrom), bright(uTo), lp);
  float tw = 0.8 + 0.2 * sin(uTime * 1.9 + aR.w * 6.2831853);
  float nearK = 1.0 - smoothstep(uCamZ - 1.4, uCamZ + 1.6, clip.w);
  float acc = aR.z;
  vCol = mix(uInk, uAccent, acc);
  vA = (0.05 + 0.5 * b) * tw * mix(0.55, 1.0, nearK) * (1.0 - 0.6 * uScatter) * (1.0 + 1.2 * fall) * mix(1.0, 1.7, acc);
  vA *= 1.0 - 0.74 * sx2 * sy2;
  gl_PointSize = clamp(uSize * aR.y * uDpr * (uCamZ / clip.w), 1.0, 14.0);
}`;

const UNIFORMS = [
  "uProj", "uCamZ", "uTime", "uProg", "uFrom", "uTo", "uScatter", "uMouse", "uMouseK", "uAspect",
  "uDpr", "uScale", "uSize", "uRotY", "uRotX", "uOffset", "uSafe", "uInk", "uAccent",
] as const;

/** Off-screen rect: nothing is dimmed. */
const NO_SAFE_ZONE: NdcRect = { x0: 3, y0: 3, x1: 3, y1: 3 };

function perspective(aspect: number): Float32Array {
  const f = 1 / Math.tan((32 * Math.PI) / 360);
  const near = 0.1;
  const far = 30;
  const nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
}

export function createParticlesRenderer(): SceneRenderer {
  let stage: Stage | null = null;
  let program: WebGLProgram | null = null;
  let vao: WebGLVertexArrayObject | null = null;
  let buffer: WebGLBuffer | null = null;
  const abort = new AbortController();
  const pointer = { x: 0, y: 0, target: 0, strength: 0 };
  let scroll = 0;
  let safe = NO_SAFE_ZONE;
  let lastTime = 0;

  return {
    async mount(canvas, options) {
      const { palette, onPhase } = options;
      const created = createStage(canvas);
      if (!created) return false;
      stage = created;
      const { gl } = created;
      // The driver compiles while the CPU builds the (cached) scene.
      const linking = linkProgram(gl, VERTEX, SOFT_POINT_FRAGMENT, "particles", abort.signal);
      const scene = morphScene();
      const linked = await linking;
      if (!linked || abort.signal.aborted) {
        if (linked) gl.deleteProgram(linked);
        return false;
      }
      program = linked;

      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, scene.data, gl.STATIC_DRAW);
      const sizes = [3, 3, 3, 3, 4, 4];
      let offset = 0;
      sizes.forEach((size, location) => {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, MORPH_STRIDE * 4, offset);
        offset += size * 4;
      });
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      const u = uniformLocations(gl, linked, UNIFORMS);
      const [gr, gg, gb] = palette.ground;
      const activeVao = vao;

      created.start(({ time, shaderTime, width, height, dpr, still }) => {
        let from = STILL_PHASE;
        let to = STILL_PHASE;
        let progress = 0;
        let local = PERIOD;
        if (!still) {
          const cycle = time % (PERIOD * PHASES);
          from = Math.floor(cycle / PERIOD);
          local = cycle - from * PERIOD;
          to = (from + 1) % PHASES;
          progress = local < HOLD ? 0 : (local - HOLD) / TRANSITION;
        }
        onPhase?.({ phase: progress < 0.5 ? from : to, progress: Math.min(1, local / PERIOD) });

        const dt = Math.min(0.1, Math.max(0, time - lastTime));
        lastTime = time;
        pointer.strength = still
          ? 0
          : pointer.strength + (pointer.target - pointer.strength) * (1 - Math.exp(-POINTER_RATE * dt));

        const aspect = width / height;
        const wide = aspect > 1.1;
        gl.viewport(0, 0, width, height);
        gl.clearColor(gr, gg, gb, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(linked);
        gl.uniformMatrix4fv(u.uProj, false, perspective(aspect));
        gl.uniform1f(u.uCamZ, CAMERA_Z);
        gl.uniform1f(u.uTime, shaderTime);
        gl.uniform1f(u.uProg, progress);
        gl.uniform1i(u.uFrom, from);
        gl.uniform1i(u.uTo, to);
        gl.uniform1f(u.uScatter, still ? 0 : scroll);
        gl.uniform2f(u.uMouse, pointer.x, pointer.y);
        gl.uniform1f(u.uMouseK, pointer.strength);
        gl.uniform1f(u.uAspect, aspect);
        gl.uniform1f(u.uDpr, dpr);
        gl.uniform1f(u.uScale, wide ? 0.64 : Math.max(0.3, Math.min(0.6, aspect * 0.92)));
        gl.uniform1f(u.uSize, wide ? 2.3 : 1.9);
        // Rotation follows the unwrapped clock (doubles), so it never snaps.
        gl.uniform1f(u.uRotY, 0.36 * Math.sin(time * 0.13));
        gl.uniform1f(u.uRotX, 0.08 * Math.sin(time * 0.1 + 1.3));
        // Wide: the shape sits upper right of the headline. Narrow: above it.
        gl.uniform2f(u.uOffset, wide ? 0.3 : 0, wide ? 0.16 : 0.36);
        gl.uniform4f(u.uSafe, safe.x0, safe.y0, safe.x1, safe.y1);
        gl.uniform3f(u.uInk, ...palette.ink);
        gl.uniform3f(u.uAccent, ...palette.accent);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.bindVertexArray(activeVao);
        gl.drawArrays(gl.POINTS, 0, scene.count);
        gl.bindVertexArray(null);
      });
      return true;
    },

    setPointer(x, y, active) {
      // Leaving keeps the last position, so the field relaxes where the pointer was.
      if (active) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.target = active ? 1 : 0;
    },

    setScroll(progress) {
      scroll = progress;
    },

    setSafeZone(rect) {
      const next = rect ?? NO_SAFE_ZONE;
      if (next.x0 === safe.x0 && next.y0 === safe.y0 && next.x1 === safe.x1 && next.y1 === safe.y1) return;
      safe = next;
      stage?.invalidate();
    },

    dispose() {
      abort.abort();
      if (stage) {
        const { gl } = stage;
        stage.dispose();
        // After a context loss these objects are already gone; deleting them on the restored context is an error.
        if (!stage.contextLost) {
          if (buffer) gl.deleteBuffer(buffer);
          if (vao) gl.deleteVertexArray(vao);
          if (program) gl.deleteProgram(program);
        }
      }
      stage = null;
      program = null;
      vao = null;
      buffer = null;
    },
  };
}
