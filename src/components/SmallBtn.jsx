export default function SmallBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "5px 14px", borderRadius: 6, border: `1px solid ${color}33`,
      background: `${color}14`, color, cursor: "pointer",
      fontFamily: "inherit", fontSize: 12, fontWeight: 600,
      transition: "all 0.15s",
    }}>{label}</button>
  );
}
