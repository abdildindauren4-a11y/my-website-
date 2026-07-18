// filepath: src/components/chat/Markdown.tsx
// Жеңіл Markdown-рендерер — AI жауаптарын әдемі көрсету үшін.
// Қолдайды: **қалың**, *көлбеу*, `код`, ### тақырып, тізімдер (-, •, 1.).
// Қауіпсіз: HTML емес, тек React элементтері құрылады.

import { type ReactNode, Fragment } from "react";

// Жол ішіндегі белгілеулер: **bold**, *italic*, `code`
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={key} className="font-mono text-[0.85em] bg-surface-2 border border-border rounded px-1 py-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

interface Block {
  type: "p" | "h" | "ul" | "ol";
  lines: string[];
}

// Мәтінді блоктарға бөлу (абзац / тақырып / тізім)
function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const lines = text.split("\n");

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      blocks.push({ type: "p", lines: [] }); // бос жол — абзац бөлгіш
      continue;
    }

    if (/^#{1,4}\s+/.test(trimmed)) {
      blocks.push({ type: "h", lines: [trimmed.replace(/^#{1,4}\s+/, "")] });
      continue;
    }

    const bullet = /^([-•*])\s+(.+)/.exec(trimmed);
    if (bullet) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.lines.push(bullet[2]);
      else blocks.push({ type: "ul", lines: [bullet[2]] });
      continue;
    }

    const numbered = /^\d+[.)]\s+(.+)/.exec(trimmed);
    if (numbered) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ol") last.lines.push(numbered[1]);
      else blocks.push({ type: "ol", lines: [numbered[1]] });
      continue;
    }

    const last = blocks[blocks.length - 1];
    if (last?.type === "p" && last.lines.length > 0) last.lines.push(trimmed);
    else blocks.push({ type: "p", lines: [trimmed] });
  }

  return blocks.filter((b) => b.lines.length > 0);
}

export default function Markdown({ text }: { text: string }) {
  const blocks = parseBlocks(text);

  return (
    <div className="text-sm leading-relaxed space-y-2">
      {blocks.map((block, bi) => {
        if (block.type === "h") {
          return (
            <p key={bi} className="font-display font-bold text-[0.95rem]">
              {renderInline(block.lines[0], `h${bi}`)}
            </p>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={bi} className="space-y-1 pl-1">
              {block.lines.map((li, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent-green shrink-0 mt-0.5">•</span>
                  <span>{renderInline(li, `ul${bi}-${i}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "ol") {
          return (
            <ol key={bi} className="space-y-1 pl-1">
              {block.lines.map((li, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent-blue font-semibold shrink-0 tabular-nums">{i + 1}.</span>
                  <span>{renderInline(li, `ol${bi}-${i}`)}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bi}>
            {block.lines.map((ln, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {renderInline(ln, `p${bi}-${i}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
