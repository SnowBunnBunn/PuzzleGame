export default function PuzzlePiece({ piece, onDragEnd }) {
  const pieceRef = useRef(null);

  useEffect(() => {
    const el = pieceRef.current;
    if (!el || piece.locked) return;

    let offsetX, offsetY;

    const onMouseDown = (e) => {
      e.preventDefault();
      offsetX = e.clientX - piece.x;
      offsetY = e.clientY - piece.y;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e) => {
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
    };

    const onMouseUp = (e) => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
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
      src={piece.image}
      alt=""
      style={{
        position: 'absolute',
        width: `${piece.width}px`,
        height: `${piece.height}px`,
        left: `${piece.x}px`,
        top: `${piece.y}px`,
        cursor: piece.locked ? 'default' : 'grab',
        border: piece.locked ? '2px solid green' : '1px solid #000',
        boxSizing: 'border-box',
        zIndex: piece.locked ? 5 : 10, // 🔧 important !
        pointerEvents: piece.locked ? 'none' : 'auto',
      }}
    />
  );
}
