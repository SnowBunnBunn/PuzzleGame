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
        const areaMargin = 60;
        const pieces = [];

        sliced.forEach((piece) => {
          const targetX = (piece.correctIndex % gridSize) * pieceWidth;
          const targetY = Math.floor(piece.correctIndex / gridSize) * pieceHeight;

          const zones = ['top', 'bottom', 'left', 'right'];
          const zone = zones[Math.floor(Math.random() * zones.length)];

          let x = 0, y = 0;

          switch (zone) {
            case 'top':
              x = Math.random() * (width - pieceWidth);
              y = -pieceHeight - Math.random() * areaMargin;
              break;
            case 'bottom':
              x = Math.random() * (width - pieceWidth);
              y = height + Math.random() * areaMargin;
              break;
            case 'left':
              x = -pieceWidth - Math.random() * areaMargin;
              y = Math.random() * (height - pieceHeight);
              break;
            case 'right':
              x = width + Math.random() * areaMargin;
              y = Math.random() * (height - pieceHeight);
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
    <div
      style={{
        textAlign: 'center',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: '#7a9ba5', // fond doux
      }}
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
