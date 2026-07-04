export function splitChars(text: string) {
  return text.split("").map((ch, i) => (
    <span key={i} className="split-char">
      {ch === " " ? " " : ch}
    </span>
  ));
}
