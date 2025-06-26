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
        {Array.from({ length: 10 }, (_, i) => i + 2).map((val) => (
            <option key={val} value={val}>{val} x {val}</option>
        ))}
      </select>
      <br />
      <button onClick={handleStartPuzzle} disabled={!selectedImage} style={{ marginTop: '1rem' }}>
        Générer le puzzle
      </button>
    </div>
  );
}
