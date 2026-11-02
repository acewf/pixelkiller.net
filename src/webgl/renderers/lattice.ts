/**
 * AI section band: points stream left to right, locked to a rigid grid on the
 * left ("rules", discrete) and released into a noise-driven flow on the right
 * ("learning", continuous). Positions come from gl_VertexID, so no buffers.
 */
import { SIMPLEX_NOISE_3D, SOFT_POINT_FRAGMENT } from "../glsl/chunks";
import { linkProgram, uniformLocations } from "../core/program";
import { createStage, type Stage } from "../core/stage";
import type { SceneRenderer } from "../core/types";

const LANES = 48;
const POINTS_PER_LANE = 170;
/** Time used for the reduced-motion still: a representative mid-stream frame. */
const STILL_TIME = 14;

const VERTEX = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
uniform float uTime, uDpr;
uniform vec3 uCold, uWarm;
out vec3 vCol;
out float vA;
${SIMPLEX_NOISE_3D}
// PCG hash: stable across GPUs, unlike fract(sin(x)).
uint pcg(uint v){
  uint state = v * 747796405u + 2891336453u;
  uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
  return (word >> 22u) ^ word;
}
float hash01(uint v){ return float(pcg(v)) * (1.0 / 4294967295.0); }
void main(){
  const int lanes = ${LANES};
  int laneIndex = gl_VertexID % lanes;
  int k = gl_VertexID / lanes;
  uint key = uint(k * lanes + laneIndex);
  float seed = hash01(key);
  float speed = 0.028 + 0.018 * hash01(key ^ 0x9e3779b9u);
  float x = fract(seed + uTime * speed) * 2.3 - 1.15;
  float yg = (float(laneIndex) + 0.5) / float(lanes) * 1.56 - 0.78;
  const float cols = 44.0;
  const int rows = 9;
  float xq = (floor((x + 1.15) / 2.3 * cols) + 0.5) / cols * 2.3 - 1.15;
  int row = (laneIndex * 2 + 1) * rows / (lanes * 2);
  float yq = (float(row) + 0.5) / float(rows) * 1.56 - 0.78;
  float w = smoothstep(-0.3, 0.35, x);
  float n1 = snoise(vec3(x * 1.5, yg * 2.0, uTime * 0.11));
  float n2 = snoise(vec3(x * 1.5 + 9.7, yg * 2.0 - 4.1, uTime * 0.11));
  vec2 p = vec2(mix(xq, x + n2 * 0.05, w), mix(yq, yg * 0.8 + n1 * 0.3, w));
  gl_Position = vec4(p, 0.0, 1.0);
  float edge = 1.0 - smoothstep(0.92, 1.12, abs(x));
  vA = edge * mix(0.14, 0.62, w);
  vCol = mix(uCold, uWarm, w);
  gl_PointSize = mix(2.2, 2.8, w) * uDpr;
}`;

export function createLatticeRenderer(): SceneRenderer {
  let stage: Stage | null = null;
  let program: WebGLProgram | null = null;
  let vao: WebGLVertexArrayObject | null = null;
  const abort = new AbortController();

  return {
    async mount(canvas, options) {
      const { palette } = options;
      const created = createStage(canvas);
      if (!created) return false;
      stage = created;
      const { gl } = created;
      const linked = await linkProgram(gl, VERTEX, SOFT_POINT_FRAGMENT, "lattice", abort.signal);
      if (!linked || abort.signal.aborted) {
        if (linked && !created.contextLost) gl.deleteProgram(linked);
        return false;
      }
      program = linked;
      vao = gl.createVertexArray();

      const u = uniformLocations(gl, linked, ["uTime", "uDpr", "uCold", "uWarm"] as const);
      const [gr, gg, gb] = palette.ground;
      // The learned side leans towards the accent.
      const warm = palette.ink.map((c, i) => c + (palette.accent[i] - c) * 0.6) as [number, number, number];
      const activeVao = vao;

      created.start(({ shaderTime, width, height, dpr, still }) => {
        gl.viewport(0, 0, width, height);
        gl.clearColor(gr, gg, gb, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(linked);
        gl.uniform1f(u.uTime, still ? STILL_TIME : shaderTime);
        gl.uniform1f(u.uDpr, dpr);
        gl.uniform3f(u.uCold, ...palette.muted);
        gl.uniform3f(u.uWarm, ...warm);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.bindVertexArray(activeVao);
        gl.drawArrays(gl.POINTS, 0, LANES * POINTS_PER_LANE);
        gl.bindVertexArray(null);
      });
      return true;
    },

    dispose() {
      abort.abort(stage?.contextLost ? "context-lost" : "disposed");
      if (stage) {
        const { gl } = stage;
        stage.dispose();
        // After a context loss these objects are already gone; deleting them on the restored context is an error.
        if (!stage.contextLost) {
          if (vao) gl.deleteVertexArray(vao);
          if (program) gl.deleteProgram(program);
        }
      }
      stage = null;
      program = null;
      vao = null;
    },
  };
}
