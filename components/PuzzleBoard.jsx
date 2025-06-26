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
      const width = img.width;
      const height = img.height;
      const pieceWidth = width / gridSize;
      const pieceHeight = height / gridSize;

      splitImage(imageSrc, gridSize).then((sliced) => {
        const spacing = 10;
        const margin = 40;
        const pieces = [];

        sliced.forEach((piece, i) => {
          const targetX = (piece.correctIndex % gridSize) * pieceWidth;
          const targetY = Math.floor(piece.correctIndex / gridSize) * pieceHeight;

          let x = 0, y = 0;
          const section = i % 4;
          const order = Math.floor(i / 4);

          switch (section) {
            case 0: // top
              x = order * (pieceWidth + spacing);
              y = -pieceHeight - margin;
              break;
            case 1: // right
              x = width + margin;
              y = order * (pieceHeight + spacing);
              break;
            case 2: // bottom
              x = order * (pieceWidth + spacing);
              y = height + margin;
              break;
            case 3: // left
              x = -pieceWidth - margin;
              y = order * (pieceHeight + spacing);
              break;
          }

          pieces.push({
            ...piece,
            width: pieceWidth,
            height: pieceHeight,
            x,
            y,
            targetX,
            targetY,
            locked: false,
          });
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
          background: '#ccc',
        }}
      >
        {pieces.map((piece) => (
          <PuzzlePiece key={piece.id} piece={piece} onDragEnd={handleDragEnd} />
        ))}
      </div>
    </div>
  );
}
