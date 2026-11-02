/**
 * Compiles and links a program without blocking: with KHR_parallel_shader_compile
 * the driver works off-thread and completion is polled once per frame; without
 * it the result is checked straight away. Resolves null (after logging the
 * driver's message) on failure, or on abort / context loss.
 */
export function linkProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
  label: string,
  signal?: AbortSignal,
): Promise<WebGLProgram | null> {
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  const release = () => {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
  };
  if (!vertex || !fragment || !program) {
    release();
    if (program) gl.deleteProgram(program);
    return Promise.resolve(null);
  }

  gl.shaderSource(vertex, vertexSource);
  gl.compileShader(vertex);
  gl.shaderSource(fragment, fragmentSource);
  gl.compileShader(fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  const finish = (): WebGLProgram | null => {
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      release();
      return program;
    }
    for (const [shader, stage] of [[vertex, "vertex"], [fragment, "fragment"]] as const) {
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(`[webgl] ${label} ${stage} shader: ${gl.getShaderInfoLog(shader)}`);
      }
    }
    console.error(`[webgl] ${label} link: ${gl.getProgramInfoLog(program)}`);
    release();
    gl.deleteProgram(program);
    return null;
  };

  const parallel = gl.getExtension("KHR_parallel_shader_compile");
  if (!parallel) return Promise.resolve(finish());

  return new Promise((resolve) => {
    const poll = () => {
      if (signal?.aborted || gl.isContextLost()) {
        release();
        gl.deleteProgram(program);
        resolve(null);
      } else if (gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR)) {
        resolve(finish());
      } else {
        requestAnimationFrame(poll);
      }
    };
    poll();
  });
}

export function uniformLocations<K extends string>(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: readonly K[],
): Record<K, WebGLUniformLocation | null> {
  const locations = {} as Record<K, WebGLUniformLocation | null>;
  for (const name of names) locations[name] = gl.getUniformLocation(program, name);
  return locations;
}
