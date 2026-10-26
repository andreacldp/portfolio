// Renders an SVG string from lib/glyphs.js
export default function Svg({ markup, className }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}
