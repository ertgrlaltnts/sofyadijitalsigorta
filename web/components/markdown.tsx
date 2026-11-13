import { Fragment, type ReactNode } from "react";

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;
const SAFE_HREF = /^(https?:\/\/|mailto:|tel:)/i;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link && SAFE_HREF.test(link[2])) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

type Block = { kind: "p"; lines: string[] } | { kind: "ul" | "ol"; items: string[] };

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  for (const line of source.replace(/\r/g, "").split("\n")) {
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
    const last = blocks[blocks.length - 1];
    if (bullet || ordered) {
      const kind = bullet ? "ul" : "ol";
      const text = (bullet ?? ordered)![1];
      if (last?.kind === kind) last.items.push(text);
      else blocks.push({ kind, items: [text] });
    } else if (line.trim() === "") {
      blocks.push({ kind: "p", lines: [] });
    } else if (last?.kind === "p") {
      last.lines.push(line.trim());
    } else {
      blocks.push({ kind: "p", lines: [line.trim()] });
    }
  }
  return blocks.filter((b) => b.kind !== "p" || b.lines.length > 0);
}

/** Minimal, XSS-safe renderer for the assistant's replies: paragraphs, lists, bold, italic, code and links. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="sofya-md">
      {parse(children).map((block, i) => {
        if (block.kind === "p") {
          return (
            <p key={i}>
              {block.lines.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  {inline(line)}
                </Fragment>
              ))}
            </p>
          );
        }
        const Tag = block.kind;
        return (
          <Tag key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </Tag>
        );
      })}
    </div>
  );
}
