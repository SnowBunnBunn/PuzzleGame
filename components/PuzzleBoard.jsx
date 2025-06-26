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
      splitImage(imageSrc, gridSize).then((sliced) => {
        const randomized = sliced.map((piece, index) => {
          const pieceWidth = width / gridSize;
          const pieceHeight = height / gridSize;

          return {
            ...piece,
            width: pieceWidth,
            height: pieceHeight,
            x: width + 30 + Math.random() * 300, // hors du board à droite
            y: 50 + Math.random() * (height - pieceHeight),
            targetX: (piece.correctIndex % gridSize) * pieceWidth,
            targetY: Math.floor(piece.correctIndex / gridSize) * pieceHeight,
            locked: false,
          };
        });
        setPieces(randomized);
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
