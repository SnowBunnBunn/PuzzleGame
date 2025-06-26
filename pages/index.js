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
        throw new Error('Lien invalide ou le fichier n’est pas une image.');
      }

      const encodedUrl = encodeURIComponent(inputUrl);
      router.push(`/puzzle?image=${encodedUrl}`);
    } catch (err) {
      setError('Le lien fourni n’est pas valide ou l’image ne peut pas être chargée.');
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
          placeholder="Entrez l'URL d'une image"
          style={{ padding: '0.5rem', width: '60%' }}
        />
        <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
          Créer le puzzle
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}
