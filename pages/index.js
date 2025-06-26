import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
  const [gridSize, setGridSize] = useState(3); // Valeur par défaut
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(inputUrl, { method: 'HEAD' });
      const contentType = res.headers.get('content-type');

      if (!res.ok || !contentType?.startsWith('image/')) {
        throw new Error('Invalid link or file is not an image.');
      }

      const encodedUrl = encodeURIComponent(inputUrl);
      router.push(`/puzzle?image=${encodedUrl}&grid=${gridSize}`);
    } catch (err) {
      setError('The link provided is invalid or the image cannot be loaded.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>🧩 Puzzle Generator</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter the URL of an image"
          style={{ padding: '0.5rem', width: '60%' }}
        />
        <div style={{ marginTop: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>Grid size (e.g. 3 = 3x3)</label>
          <input
            type="number"
            min={2}
            max={10}
            value={gridSize}
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            style={{ width: '60px', textAlign: 'center' }}
          />
        </div>
        <button type="submit" style={{ marginTop: '1.5rem', padding: '0.5rem 1rem' }}>
          Create the puzzle
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}
