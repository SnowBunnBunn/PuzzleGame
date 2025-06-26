import { useRef, useEffect } from 'react';

export default function PuzzlePiece({ piece, onDragEnd, allLocked }) {
  const pieceRef = useRef(null);

  useEffect(() => {
    const el = pieceRef.current;
    if (!el || piece.locked) return;

    let offsetX, offsetY;

    const onMouseDown = (e) => {
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const newX = e.pageX - offsetX;
      const newY = e.pageY - offsetY;
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
    };

    const onMouseUp = (e) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const newX = e.pageX - offsetX;
      const newY = e.pageY - offsetY;
      onDragEnd(piece.id, newX, newY);
    };

    el.addEventListener('mousedown', onMouseDown);
    return () => {
      el.removeEventListener('mousedown', onMouseDown);
    };
  }, [piece, onDragEnd]);

  return (
    <img
      ref={pieceRef}
      src={piece.image || piece.dataUrl}
      alt=""
      style={{
        position: 'absolute',
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: `${piece.locked ? piece.targetX : piece.x}px`,
        top: `${piece.locked ? piece.targetY : piece.y}px`,
        cursor: piece.locked ? 'default' : 'grab',
        border: piece.locked && !allLocked ? '2px solid green' : '1px solid #000',
        boxSizing: 'border-box',
        zIndex: piece.locked ? 5 : 10,
        pointerEvents: piece.locked ? 'none' : 'auto',
        transition: piece.locked ? 'left 0.15s ease, top 0.15s ease' : 'none',
      }}
    />
  );
}
