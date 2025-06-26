import { useState, useEffect } from 'react';
import PuzzlePiece from './PuzzlePiece';
import { splitImage } from '../utils/splitImage';

export default function PuzzleBoard({ imageSrc, gridSize }) {
  const [pieces, setPieces] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    // Charger les dimensions réelles de l'image
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
      splitImage(imageSrc, gridSize).then(setPieces);
    };
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
  const pieceWidth = imageSize.width / gridSize;
  const pieceHeight = imageSize.height / gridSize;

  return (
    <div style={{ textAlign: 'center' }}>
      <h3>{isCompleted ? '🎉 Puzzle terminé !' : 'Clique sur deux pièces pour les échanger.'}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${pieceWidth}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${pieceHeight}px)`,
          width: `${imageSize.width}px`,
          height: `${imageSize.height}px`,
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
              width: `${pieceWidth}px`,
              height: `${pieceHeight}px`,
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
