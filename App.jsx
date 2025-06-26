// App.jsx
import { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import PuzzleBoard from './components/PuzzleBoard';

function App() {
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

export default App;
