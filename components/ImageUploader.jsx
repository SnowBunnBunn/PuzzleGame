import { useState } from 'react';

export default function ImageUploader({ onStart }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [gridSize, setGridSize] = useState(3);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartPuzzle = () => {
    if (selectedImage) {
      onStart(selectedImage, gridSize);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <h2>Créer votre puzzle</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br />
      <label>Nombre de pièces (par côté): </label>
      <select value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}>
        <option value={3}>3 x 3</option>
        <option value={4}>4 x 4</option>
        <option value={5}>5 x 5</option>
        <option value={6}>6 x 6</option>
      </select>
      <br />
      <button onClick={handleStartPuzzle} disabled={!selectedImage} style={{ marginTop: '1rem' }}>
        Générer le puzzle
      </button>
    </div>
  );
}
