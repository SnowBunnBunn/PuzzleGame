// utils/splitImage.js
export async function splitImage(imageSrc, gridSize) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const pieces = [];
      const pieceWidth = img.width / gridSize;
      const pieceHeight = img.height / gridSize;

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const canvas = document.createElement('canvas');
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          const ctx = canvas.getContext('2d');

          ctx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          const dataURL = canvas.toDataURL();
          pieces.push({
            id: `${row}-${col}`,
            correctIndex: row * gridSize + col,
            image: dataURL,
          });
        }
      }

      // Mélanger aléatoirement les pièces
      const shuffled = [...pieces].sort(() => Math.random() - 0.5);
      resolve(shuffled);
    };
  });
}
