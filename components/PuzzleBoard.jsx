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
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const maxBoardWidth = viewportWidth * 0.6;
      const maxBoardHeight = viewportHeight * 0.8;

      const scale = Math.min(maxBoardWidth / img.width, maxBoardHeight / img.height, 1);

      const boardWidth = img.width * scale;
      const boardHeight = img.height * scale;
      const pieceWidth = boardWidth / gridSize;
      const pieceHeight = boardHeight / gridSize;

      splitImage(imageSrc, gridSize).then((sliced) => {
        const marginX = 10;
        const boardX = (viewportWidth - boardWidth) / 2;
        const boardY = (viewportHeight - boardHeight) / 2;

        const pieces = [];
        const half = Math.ceil(sliced.length / 2);
        const left = sliced.slice(0, half);
        const right = sliced.slice(half);

        const distribute = (list, side) => {
          list.forEach((piece) => {
            const targetX = boardX + (piece.correctIndex % gridSize) * pieceWidth;
            const targetY = boardY + Math.floor(piece.correctIndex / gridSize) * pieceHeight;

            const x = side === 'left'
              ? boardX - pieceWidth - marginX
              : boardX + boardWidth + marginX;

            // Y = random dans la hauteur visible
            const y = boardY + Math.random() * (boardHeight - pieceHeight);

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

        distribute(left, 'left');
        distribute(right, 'right');

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
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#7a9ba5',
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
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
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
