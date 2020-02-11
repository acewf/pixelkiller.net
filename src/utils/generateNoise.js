import { snoise } from './noise3D';

export const generate = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(canvas.width * 2, canvas.height * 2);
  let data = imageData.data;

  var SIZE = 52;
  for (var k = 0; k < SIZE; ++k) {
    for (var j = 0; j < SIZE; ++j) {
      for (var i = 0; i < SIZE; ++i) {
        const index = i + j * SIZE + k * SIZE * SIZE;
        if (index === 10420) {
          console.log(`x:${i} y:${j} z:${k} index:${index}`);
        }

        data[index] = snoise([i, j, k]) * 256;
      }
    }
  }

  console.log(imageData.data)

  return imageData;
  /*
  ctx.putImageData(imageData, 0, 0);

  canvas.toBlob(function (blob) {
    var newImg = document.createElement('img'),
      url = URL.createObjectURL(blob);

    newImg.onload = function () {
      // no longer need to read the blob so it's revoked
      // URL.revokeObjectURL(url);
    };
    newImg.src = url;
    document.body.appendChild(newImg);
  });
  */
}
