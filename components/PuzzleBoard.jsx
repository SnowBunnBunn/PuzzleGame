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
    const spacing = 6;
    const marginX = 40;
    const areaHeight = height;
    const pieces = [];

    // Diviser en deux moitiés (gauche / droite)
    const half = Math.ceil(sliced.length / 2);
    const leftPieces = sliced.slice(0, half);
    const rightPieces = sliced.slice(half);

    const distribute = (list, side) => {
      const totalHeight = list.length * (pieceHeight + spacing);
      const startY = Math.max((areaHeight - totalHeight) / 2, 0);

      list.forEach((piece, i) => {
        const x =
          side === 'left'
            ? -pieceWidth - marginX
            : width + marginX;
        const y = startY + i * (pieceHeight + spacing);
        const targetX = (piece.correctIndex % gridSize) * pieceWidth;
        const targetY = Math.floor(piece.correctIndex / gridSize) * pieceHeight;

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
    };

    distribute(leftPieces, 'left');
    distribute(rightPieces, 'right');

    setPieces(pieces);
  });
};
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
    <div

    >
      <h3 style={{ marginTop: '1rem' }}>
        {allLocked ? '🎉 Puzzle terminé !' : 'Glisse chaque pièce au bon endroit.'}
      </h3>

      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: boardWidth,
          height: boardHeight,
          margin: 'auto',
          border: '2px solid #333',
          backgroundColor: '#ccc',
        }}
      >
        {pieces.map((piece) => (
          <PuzzlePiece key={piece.id} piece={piece} onDragEnd={handleDragEnd} />
        ))}
      </div>
    </div>
  );
}
