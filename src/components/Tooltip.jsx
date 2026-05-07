export default function Tooltip({ text, x, y, visible }) {
  return (
    <div
      className={`tooltip${visible ? ' visible' : ''}`}
      style={{ left: x + 14, top: y - 10 }}
    >
      {text}
    </div>
  );
}
