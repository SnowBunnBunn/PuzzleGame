// components/PuzzlePiece.jsx
export default function PuzzlePiece({ image, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        cursor: 'pointer',
      }}
    />
  );
}
