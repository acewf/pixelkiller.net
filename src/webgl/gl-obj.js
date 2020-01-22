import * as WebGL from './webgl';

class GL {
  constructor({ canvas, options, vert, frag }) {
    this.canvas = canvas;
    this.gl = null;
    this.program = null;
    this.init(options, vert, frag);
  }

  init(options, vert, frag) {
    this.gl = WebGL.getContext(this.canvas, options);
    this.program = this.createProgram(vert, frag);
    this.useProgram(this.program);
    this.updateViewPort(this.canvas.width, this.canvas.height);
  }

  createProgram(vert, frag) {
    const program = WebGL.createProgram(this.gl, vert, frag);
    WebGL.createBuffers(this.gl, program);
    return program;
  }

  useProgram(program) {
    this.program = program;
    this.gl.useProgram(program);
  }
  createTexture(source, i, wrap, { isCube = false, isVideo = false, is3DTexture = false }) {
    if (isCube) {
      return WebGL.createCubeTexture(this.gl, source, i, wrap);
    }
    if (isVideo) {
      return WebGL.videoTexture(this.gl, source, i);
    }
    if (is3DTexture) {
      return WebGL.create3DTexture(this.gl, source, i);
    }
    return WebGL.createTexture(this.gl, source, i, wrap);
  }
  createUniform(type, name, ...v) {
    WebGL.createUniform(this.gl, this.program, type, name, ...v);
  }

  activeTexture(i) {
    WebGL.activeTexture(this.gl, i);
  }

  updateTexture(source, texture) {
    if (texture) {
      WebGL.bindTexture(this.gl, texture)
    }

    WebGL.updateTexture(this.gl, source);
  }

  draw() {
    WebGL.setRectangle(this.gl, -1, -1, 2, 2);
    this.gl.drawArraysInstanced(this.gl.TRIANGLES, 0, 6, 1);
    //this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  updateViewPort(width, height) {
    this.gl.viewport(0, 0, width, height);
  }
}

export default GL;
