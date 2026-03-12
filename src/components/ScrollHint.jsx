export default function ScrollHint({ visible }) {
  return (
    <div id="scroll-hint" style={{ opacity: visible ? 1 : 0 }}>
      <div className="scroll-line" />
      <div className="scroll-label">Scroll</div>
    </div>
  )
}
