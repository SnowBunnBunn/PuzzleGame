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

        const left = [];
        const right = [];

        // Répartition alternée entre gauche et droite
        sliced.forEach((piece, i) => {
          if (i % 2 === 0) {
            left.push(piece);
          } else {
            right.push(piece);
          }
        });

        const maxPieces = Math.max(left.length, right.length);
        const availableHeight = boardHeight - pieceHeight;
        const spacing = availableHeight / Math.max(maxPieces - 1, 1);

        const pieces = [];

        const distribute = (list, side) => {
          list.forEach((piece, i) => {
            const targetX = boardX + (piece.correctIndex % gridSize) * pieceWidth;
            const targetY = boardY + Math.floor(piece.correctIndex / gridSize) * pieceHeight;

            const x =
              side === 'left'
                ? boardX - pieceWidth - marginX
                : boardX + boardWidth + marginX;

            const y = boardY + i * spacing;

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
    <h3 style={{ textAlign: 'center', marginTop: '1rem' }}>
      {allLocked ? '🎉 Puzzle terminé !' : 'Glisse chaque pièce au bon endroit.'}
    </h3>

    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: boardWidth + 2 * (pieces[0]?.width + 20),
        height: boardHeight,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: boardWidth,
          height: boardHeight,
          border: '2px solid #333',
          backgroundColor: '#ccc',
        }}
      >
        {pieces.map((piece) => (
          <PuzzlePiece key={piece.id} piece={piece} onDragEnd={handleDragEnd} />
        ))}
      </div>
    </div>
  </div>
);

}
