import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import PuzzlePiece from '../components/PuzzlePiece';
import { splitImage } from '../utils/splitImage';

export default function PuzzleBoard() {
  const router = useRouter();
  const { image: imageSrc, grid = '3' } = router.query;
  const gridSize = parseInt(grid);

  const [pieces, setPieces] = useState([]);
  const [boardX, setBoardX] = useState(0);
  const [boardY, setBoardY] = useState(0);
  const [boardWidthState, setBoardWidthState] = useState(0);
  const [boardHeightState, setBoardHeightState] = useState(0);
  const [allLocked, setAllLocked] = useState(false);
  const boardRef = useRef(null);

  const loadImageAsDataUrl = async (url) => {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    if (!imageSrc) return;

    loadImageAsDataUrl(imageSrc).then((dataUrl) => {
      const img = new Image();
      img.src = dataUrl;

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

        const totalWidth = boardWidth + pieceWidth * 2 + 10 * 2;
        const calculatedBoardX = (viewportWidth - totalWidth) / 2 + pieceWidth + 10;
        const calculatedBoardY = (viewportHeight - boardHeight) / 2;

        setBoardX(calculatedBoardX);
        setBoardY(calculatedBoardY);
        setBoardWidthState(boardWidth);
        setBoardHeightState(boardHeight);

        splitImage(dataUrl, gridSize).then((sliced) => {
          const marginX = 10;
          const left = [];
          const right = [];

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

          const allPieces = [];

          const distribute = (list, side) => {
            list.forEach((piece, i) => {
              const targetX = calculatedBoardX + (piece.correctIndex % gridSize) * pieceWidth;
              const targetY = calculatedBoardY + Math.floor(piece.correctIndex / gridSize) * pieceHeight;

              const x = side === 'left'
                ? calculatedBoardX - pieceWidth - marginX
                : calculatedBoardX + boardWidth + marginX;

              const y = calculatedBoardY + i * spacing;

              allPieces.push({
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
          setPieces(allPieces);
        });
      };
    });
  }, [imageSrc, gridSize]);

  const handleDragEnd = (id, x, y) => {
    setPieces((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== id || p.locked) return p;

        const dx = Math.abs(x - p.targetX);
        const dy = Math.abs(y - p.targetY);
        const tolerance = 20;

        if (dx <= tolerance && dy <= tolerance) {
          return {
            ...p,
            x: p.targetX,
            y: p.targetY,
            locked: true,
          };
        }

        return { ...p, x, y };
      });

      setAllLocked(updated.every((p) => p.locked));
      return updated;
    });
  };

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
        ref={boardRef}
        style={{
          position: 'absolute',
          left: boardX,
          top: boardY,
          width: boardWidthState,
          height: boardHeightState,
          border: '2px solid black',
          background: '#ccc',
        }}
      />

      {pieces.map((piece) => (
        <PuzzlePiece
          key={piece.id}
          piece={{ ...piece, showBorder: !allLocked }}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
