import type { GuideBlock } from "@/data/guides";
import type { LegalBlock } from "@/data/legal";

type AnyBlock = GuideBlock | LegalBlock;

/** Rendu des blocs de contenu éditorial (guides, pages légales). */
export function Blocks({ blocks }: { blocks: AnyBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ol>
            );
          case "quote":
            return <blockquote key={i}>{b.text}</blockquote>;
          case "table":
            return (
              <div key={i} className="overflow-x-auto -mx-1 px-1">
                <table>
                  <thead>
                    <tr>
                      {b.headers.map((h, j) => (
                        <th key={j}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>{c}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
