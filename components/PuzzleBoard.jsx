// components/PuzzleBoard.jsx
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

  const size = 100 / gridSize + '%';

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{isCompleted ? '🎉 Puzzle terminé !' : 'Clique sur deux pièces pour les échanger.'}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          width: '80vmin',
          height: '80vmin',
          margin: 'auto',
          border: '2px solid #333',
        }}
      >
        {pieces.map((piece, index) => (
          <div
            key={index}
            onClick={() => handlePieceClick(index)}
            style={{
              width: size,
              height: size,
              border: selectedIndex === index ? '2px solid red' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          >
            <PuzzlePiece image={piece.image} />
          </div>
        ))}
      </div>
    </div>
  );
}
