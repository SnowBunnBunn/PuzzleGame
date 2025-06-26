import { useState, useEffect } from 'react';
import PuzzlePiece from './PuzzlePiece';
import { splitImage } from '../utils/splitImage';

export default function PuzzleBoard({ imageSrc, gridSize }) {
  const [pieces, setPieces] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    splitImage(imageSrc, gridSize).then(setPieces);
  }, [imageSrc, gridSize]);

  const handlePieceClick = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const newPieces = [...pieces];
      [newPieces[selectedIndex], newPieces[index]] = [newPieces[index], newPieces[selectedIndex]];
      setPieces(newPieces);
      setSelectedIndex(null);
    }
  };

  const isCompleted = pieces.every((piece, index) => piece.correctIndex === index);

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{isCompleted ? '🎉 Puzzle terminé !' : 'Clique sur deux pièces pour les échanger.'}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: '1px',
          width: '90vmin',
          maxWidth: '90vw',
          aspectRatio: '1 / 1',
          margin: 'auto',
          border: '2px solid #333',
          background: '#000',
        }}
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            onClick={() => handlePieceClick(index)}
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              border: selectedIndex === index ? '2px solid red' : '1px solid #222',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            <PuzzlePiece image={piece.image} />
          </div>
        ))}
      </div>
    </div>
  );
}
