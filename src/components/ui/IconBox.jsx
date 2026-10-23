export default function IconBox({ children, tone = 'green' }) {
  return <span className={`icon-box ${tone}`}>{children}</span>;
}
