import { useEffect, useState, useRef } from 'react';
import PuzzlePiece from './PuzzlePiece';
import { splitImage } from '../utils/splitImage';

export default function PuzzleBoard({ imageSrc, gridSize }) {
  const [pieces, setPieces] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
  const { width, height } = img;
  const pieceWidth = width / gridSize;
  const pieceHeight = height / gridSize;

  splitImage(imageSrc, gridSize).then((sliced) => {
    const positions = [];

    const margin = 20;
    const spacing = 10;

    // total number of pieces
    const total = sliced.length;

    // distribute pieces equally around the 4 sides
    const perSide = Math.ceil(total / 4);
    let topCount = 0, bottomCount = 0, leftCount = 0, rightCount = 0;

    const pieces = sliced.map((piece, index) => {
      // Target position (correct spot)
      const targetX = (piece.correctIndex % gridSize) * pieceWidth;
      const targetY = Math.floor(piece.correctIndex / gridSize) * pieceHeight;

      let x = 0, y = 0;

      if (topCount < perSide) {
        // top
        x = margin + topCount * (pieceWidth + spacing);
        y = targetY - pieceHeight - spacing - 30;
        topCount++;
      } else if (rightCount < perSide) {
        // right
        x = width + spacing + 30;
        y = margin + rightCount * (pieceHeight + spacing);
        rightCount++;
      } else if (bottomCount < perSide) {
        // bottom
        x = margin + bottomCount * (pieceWidth + spacing);
        y = height + spacing + 30;
        bottomCount++;
      } else {
        // left
        x = -pieceWidth - spacing - 30;
        y = margin + leftCount * (pieceHeight + spacing);
        leftCount++;
      }

      return {
        ...piece,
        width: pieceWidth,
        height: pieceHeight,
        x,
        y,
        targetX,
        targetY,
        locked: false,
      };
    });

    setPieces(pieces);
  });
};

  }, [imageSrc, gridSize]);

  const handleDragEnd = (id, x, y) => {
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== id || p.locked) return p;

        const dx = Math.abs(x - p.targetX);
        const dy = Math.abs(y - p.targetY);
        const tolerance = 15;

        if (dx <= tolerance && dy <= tolerance) {
          return {
            ...p,
            x: p.targetX,
            y: p.targetY,
            locked: true,
          };
        }

        return { ...p, x, y };
      })
    );
  };

  const allLocked = pieces.length > 0 && pieces.every((p) => p.locked);
  const boardWidth = pieces[0]?.width * gridSize || 0;
  const boardHeight = pieces[0]?.height * gridSize || 0;

  return (
    <div style={{ textAlign: 'center', position: 'relative', height: '100vh' }}>
      <h3>{allLocked ? '🎉 Puzzle terminé !' : 'Glisse chaque pièce au bon endroit.'}</h3>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: boardWidth,
          height: boardHeight,
          border: '2px solid #333',
          margin: 'auto',
        }}
      >
        {pieces.map((piece) => (
          <PuzzlePiece key={piece.id} piece={piece} onDragEnd={handleDragEnd} />
        ))}
      </div>
    </div>
  );
}
