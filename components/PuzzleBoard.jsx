import { useState, useEffect } from 'react';
import PuzzlePiece from './PuzzlePiece';
import { splitImage } from '../utils/splitImage';

export default function PuzzleBoard({ imageSrc, gridSize }) {
  const [pieces, setPieces] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      splitImage(imageSrc, gridSize).then((sliced) => {
        const piecesWithLock = sliced.map((piece, idx) => ({
          ...piece,
          locked: false,
        }));
        setPieces(piecesWithLock);
      });
    };
  }, [imageSrc, gridSize]);

  const pieceWidth = imageSize.width / gridSize;
  const pieceHeight = imageSize.height / gridSize;

  const handleDrop = (targetIndex) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newPieces = [...pieces];

    // Échange seulement si les deux pièces ne sont pas verrouillées
    if (newPieces[draggedIndex].locked || newPieces[targetIndex].locked) return;

    [newPieces[draggedIndex], newPieces[targetIndex]] = [
      newPieces[targetIndex],
      newPieces[draggedIndex],
    ];

    // Vérifie si les deux pièces sont maintenant bien placées
    [draggedIndex, targetIndex].forEach((i) => {
      const piece = newPieces[i];
      if (piece.correctIndex === i) {
        piece.locked = true;
      }
    });

    setPieces(newPieces);
    setDraggedIndex(null);
  };

  const isCompleted = pieces.every((p, i) => p.correctIndex === i);

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{isCompleted ? '🎉 Puzzle terminé !' : 'Glissez les pièces au bon endroit.'}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${pieceWidth}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${pieceHeight}px)`,
          width: `${imageSize.width}px`,
          height: `${imageSize.height}px`,
          margin: 'auto',
          border: '2px solid #333',
        }}
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            style={{
              width: `${pieceWidth}px`,
              height: `${pieceHeight}px`,
              border: piece.locked ? '2px solid green' : '1px solid #222',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <PuzzlePiece
              image={piece.image}
              draggable={!piece.locked}
              onDragStart={() => setDraggedIndex(index)}
              locked={piece.locked}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
