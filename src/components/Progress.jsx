export default function Progress({ currentSection, total }) {
  return (
    <div id="progress">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`prog-dot${i === currentSection ? ' active' : ''}`} />
      ))}
    </div>
  )
}
