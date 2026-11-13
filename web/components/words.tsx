/** Headline whose words rise out of a mask one after another. */
export function Words({ text, base = 0.2, className = "" }: { text: string; base?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden className="word" style={{ "--i": i, "--base": `${base}s` } as React.CSSProperties}>
          <span>{word}&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
