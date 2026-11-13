export const CHUNK_SIZE = 1500;
export const CHUNK_OVERLAP = 200;

export interface ChunkSource {
  title: string;
  content: string;
  type: 'faq' | 'article';
}

export function chunkEntry({ title, content, type }: ChunkSource): string[] {
  if (type === 'faq') return [`Soru: ${title}\nCevap: ${content.trim()}`];
  return splitText(content).map((part) => `${title}\n\n${part}`);
}

function splitText(text: string): string[] {
  const pieces = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .flatMap(splitLongParagraph);

  const chunks: string[] = [];
  let current = '';
  for (const piece of pieces) {
    if (current && current.length + piece.length + 2 > CHUNK_SIZE) {
      chunks.push(current);
      current = `${overlapTail(current)}\n\n${piece}`.trim();
    } else {
      current = current ? `${current}\n\n${piece}` : piece;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function splitLongParagraph(paragraph: string): string[] {
  if (paragraph.length <= CHUNK_SIZE) return [paragraph];
  const sentences = paragraph.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) ?? [paragraph];
  const parts: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && current.length + sentence.length > CHUNK_SIZE) {
      parts.push(current.trim());
      current = '';
    }
    current += sentence;
    while (current.length > CHUNK_SIZE) {
      parts.push(current.slice(0, CHUNK_SIZE).trim());
      current = current.slice(CHUNK_SIZE);
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function overlapTail(text: string): string {
  if (text.length <= CHUNK_OVERLAP) return text;
  const tail = text.slice(-CHUNK_OVERLAP);
  const firstSpace = tail.indexOf(' ');
  return firstSpace === -1 ? tail : tail.slice(firstSpace + 1);
}
