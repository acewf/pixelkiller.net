export function getContext(canvas, options = {}) {
  const contexts = ['webgl', 'experimental-webgl'];
  let context = null;

  contexts.some((name) => {
    try {
      context = canvas.getContext(name, options);
    } catch (e) {
      throw new Error(e);
    }

    return context != null;
  });

  if (context == null) {
    document.body.classList.add('no-webgl');
  }

  return context;
}

function error(msg) {
  // eslint-disable-next-line no-console
  console.error(msg);
}

export function createShader(gl, script, type) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, script);
  gl.compileShader(shader);

  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!compiled) {
    const lastError = gl.getShaderInfoLog(shader);

    error(`Error compiling shader '${shader}':${lastError}`);
    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

export function createProgram(gl, vertexScript, fragScript) {
  const vertexShader = createShader(gl, vertexScript, gl.VERTEX_SHADER);
  const fragShader = createShader(gl, fragScript, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  const linked = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!linked) {
    const lastError = gl.getProgramInfoLog(program);

    error(`Error in program linking: ${lastError}`);
    gl.deleteProgram(program);

    return null;
  }

  const positionLocation = gl.getAttribLocation(program, 'a_position');

  const texCoordBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0
    ]),
    gl.STATIC_DRAW
  );

  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  return program;
}
export function activeTexture(gl, i) {
  gl.activeTexture(gl[`TEXTURE${i}`]);
}

export function updateTexture(gl, source) {
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
}

export function createTexture(gl, source, i, wrap = null) {
  const Wrapper = wrap || gl.CLAMP_TO_EDGE;
  const texture = gl.createTexture();

  activeTexture(gl, i);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, Wrapper);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, Wrapper);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  updateTexture(gl, source);

  return texture;
}

export function createCubeTexture(gl, source, i, wrap = null) {
  const Wrapper = wrap || gl.CLAMP_TO_EDGE;
  const texture = gl.createTexture();
  // activeTexture(gl, i);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

  const faces = [
    gl.TEXTURE_CUBE_MAP_POSITIVE_X,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
    gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
    gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
  ];

  // Upload the canvas to the cubemap face.
  const level = 0;
  const internalFormat = gl.RGBA;
  const format = gl.RGBA;
  const type = gl.UNSIGNED_BYTE;
  faces.forEach((faceTarget) => {
    gl.texImage2D(faceTarget, level, internalFormat, format, type, source);
  })

  // Set the parameters so we can render any size image.
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  return texture;
}

export function createUniform(gl, program, type, name, ...args) {
  const location = gl.getUniformLocation(program, `u_${name}`);

  gl[`uniform${type}`](location, ...args);
}

export function setRectangle(gl, x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}
