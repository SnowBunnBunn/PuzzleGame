import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const [inputUrl, setInputUrl] = useState('');
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
      router.push(`/puzzle?image=${encodedUrl}`);
    } catch (err) {
      setError('The link provided is invalid or the image cannot be loaded.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>🧩 Générateur de Puzzle</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter the URL of an image"
          style={{ padding: '0.5rem', width: '60%' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Create the puzzle
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}
