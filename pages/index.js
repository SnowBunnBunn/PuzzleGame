// pages/index.js
import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import PuzzleBoard from '../components/PuzzleBoard';

export default function Home() {
  const [image, setImage] = useState(null);
  const [gridSize, setGridSize] = useState(null);

  const handleStart = (img, size) => {
    setImage(img);
    setGridSize(size);
  };

  return (
    <div>
      {!image ? (
        <ImageUploader onStart={handleStart} />
      ) : (
        <PuzzleBoard imageSrc={image} gridSize={gridSize} />
      )}
    </div>
  );
}
