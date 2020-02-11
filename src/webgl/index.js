import GL from './gl-obj';

export const getBin = (src) => {
  return new Promise((resolve) => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', src, true);
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.onload = function () {
      const data = xmlHttp.response;
      const buffer = new Uint8Array(data, 20);
      resolve(buffer);
    }
    xmlHttp.send("");
  });
}

const getDPI = () => {
  if (typeof window.devicePixelRatio !== 'undefined') {
    return window.devicePixelRatio;
  }

  return 1;
};

function loadTexture(index, file) {
  return new Promise((resolve) => {
    if (file.url) {
      const image = new Image();
      image.addEventListener('load', () => {
        resolve(image);
      });
      image.src = file.url;
    } else {

      resolve(file);
    }
  });
}

class WebGl {
  constructor({ canvas, fragShader, vertShader, textures = [], videoTextures = [] }) {
    this.isRendering = false;
    this.canvas = canvas;
    this.videoTextures = [];
    this.nextTextureIndex = 0;
    const dpi = getDPI(canvas);
    canvas.width = canvas.clientWidth * dpi;
    canvas.height = canvas.clientHeight * dpi;
    this.gl = new GL({ canvas, vert: vertShader, frag: fragShader });
    this.gl.createUniform('1f', 'time', 0);
    this.gl.createUniform(
      '2f',
      'resolution',
      canvas.clientWidth * dpi,
      canvas.clientHeight * dpi
    );
    // this.update3DTextures();
    this.updateTextures(textures);
    /// this.updateVideoTextures(videoTextures);

    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    const dpi = getDPI(this.canvas);
    this.canvas.width = this.canvas.clientWidth * dpi;
    this.canvas.height = this.canvas.clientHeight * dpi;
    this.gl.updateViewPort(this.canvas.width, this.canvas.height);
  }

  async update3DTextures() {
    const scope = this;
    const asset = await getBin('http://localhost:3000/cube.bin');
    scope.gl.createUniform('1i', `texture${0}`, scope.nextTextureIndex);
    // console.log('Asset:', asset)
    /* var SIZE = 52;
    var data = new Uint8Array(SIZE * SIZE * SIZE);
    for (var k = 0; k < SIZE; ++k) {
      for (var j = 0; j < SIZE; ++j) {
        for (var i = 0; i < SIZE; ++i) {
          data[i + j * SIZE + k * SIZE * SIZE] = snoise([i, j, k]) * 256;
        }
      }
    } */
    scope.gl.createTexture(
      asset,
      scope.nextTextureIndex,
      null,
      { is3DTexture: true }
    );
    scope.render();
  }

  async updateTextures(textures) {
    const scope = this;
    const loadedTextures = await this.getTextures(textures);
    loadedTextures.forEach((asset, index) => {
      scope.gl.createUniform('1i', `texture${index}`, scope.nextTextureIndex);

      scope.gl.createTexture(
        asset,
        scope.nextTextureIndex,
        null
      );
      scope.nextTextureIndex++;
    });
    scope.render();
  }

  updateVideoTextures(textures) {
    const scope = this;
    this.videoTextures = textures.map((texture, index) => {
      scope.gl.createUniform('1i', `videotexture${index}`, scope.nextTextureIndex);
      const nextTextureIndex = scope.nextTextureIndex;
      scope.nextTextureIndex++;
      return {
        source: texture,
        texture: scope.gl.createTexture(texture, nextTextureIndex, null, { isVideo: true })
      };

    });
  }

  getTextures(textures) {
    const loadingTextures = textures.map((file, i) => loadTexture(i, file));
    return Promise.all(loadingTextures);
  }

  render() {
    const scope = this;
    const loops = 0.001;
    scope.isRendering = true;
    const update = (now) => {
      if (scope.isRendering) {
        scope.gl.createUniform('1f', 'time', now * loops);
        this.videoTextures.forEach(({ texture, source }) => {
          scope.gl.updateTexture(source, texture);
        });
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