import * as WebGL from './webgl';

class GL {
  constructor({ canvas, options, vert, frag }) {
    this.canvas = canvas;
    this.gl = null;
    this.program = null;
    this.width = canvas.clientWidth;
    this.height = canvas.clientWidth;
    this.init(options, vert, frag);
  }

  init(options, vert, frag) {
    this.gl = WebGL.getContext(this.canvas, options);
    this.program = this.createProgram(vert, frag);
    this.useProgram(this.program);
    this.updateViewPort();
  }

  createProgram(vert, frag) {
    const program = WebGL.createProgram(this.gl, vert, frag);

    return program;
  }

  useProgram(program) {
    this.program = program;
    this.gl.useProgram(program);
  }
  createTexture(source, i, wrap, isCube) {
    if (isCube) {
      return WebGL.createCubeTexture(this.gl, source, i, wrap);
    }
    return WebGL.createTexture(this.gl, source, i, wrap);
  }
  createUniform(type, name, ...v) {
    WebGL.createUniform(this.gl, this.program, type, name, ...v);
  }

  activeTexture(i) {
    WebGL.activeTexture(this.gl, i);
  }

  updateTexture(source) {
    WebGL.updateTexture(this.gl, source);
  }

  draw() {
    WebGL.setRectangle(this.gl, -1, -1, 2, 2);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  updateViewPort() {
    console.log(this.width)
    // this.gl.viewport(0, 0, this.width, this.height);
  }
}

export default GL;
