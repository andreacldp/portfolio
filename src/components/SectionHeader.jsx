export default function SectionHeader({ num, label, coord, children }) {
  return (
    <header className="sec-head reveal">
      <div className="sec-head__meta mono">
        <span className="num">§ {num}</span>
        <span>{label}</span>
        <span className="rule" />
        <span>{coord}</span>
      </div>
      <h2 className="sec-head__title">{children}</h2>
    </header>
  );
}
