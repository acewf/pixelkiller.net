import GL from './gl-obj';
// import fill from './fill';

const getDPI = () => {
  if (typeof window.devicePixelRatio !== 'undefined') {
    return window.devicePixelRatio;
  }

  return 1;
};

function loadTexture(index, file) {
  return new Promise((resolve) => {
    const image = new Image();

    image.addEventListener('load', () => {
      // haze.gl.createUniform('1i', options.name, index);
      resolve(image);
    });
    image.src = file;
  });
}

class WebGl {
  constructor({ canvas, fragShader, vertShader, textures = [] }) {
    this.isRendering = false;
    this.canvas = canvas;
    const dpi = getDPI();
    canvas.width = canvas.clientWidth * dpi;
    canvas.height = canvas.clientHeight * dpi;
    console.log('++this.gl++', this.gl)
    this.gl = new GL({ canvas, vert: vertShader, frag: fragShader });
    this.gl.createUniform('1f', 'time', 0);
    this.gl.createUniform(
      '2f',
      'resolution',
      canvas.clientWidth * dpi,
      canvas.clientHeight * dpi
    );
    this.updateTextures(textures);
  }

  async updateTextures(textures) {
    const scope = this;
    const loadedTextures = await this.getTextures(textures);
    loadedTextures.forEach((asset, index) => {
      scope.gl.createUniform('1i', `texture${index}`, index);
      scope.gl.createTexture(
        asset,
        index,
        null,
        true
      );
    })
    scope.render();
  }

  getTextures(textures) {
    const loadingTextures = textures.map((file, i) => loadTexture(i, file));
    return Promise.all(loadingTextures);
  }

  render() {
    const scope = this;
    const loops = 1000;
    scope.isRendering = true;
    const update = (now) => {
      if (scope.isRendering) {
        scope.gl.createUniform('1f', 'time', now / loops);
        scope.gl.draw();
        requestAnimationFrame(update);
      }
    }
    update(0);
  }

  pause() {
    this.isRendering = false;
  }

  resume() {
    this.render();
  }
}

export default WebGl;