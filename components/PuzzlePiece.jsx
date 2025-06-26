export default function PuzzlePiece({ image, draggable, onDragStart, locked }) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        opacity: locked ? 0.9 : 1,
        cursor: draggable ? 'grab' : 'default',
      }}
    />
  );
}
