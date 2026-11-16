import type { GuideBlock } from "@/data/guides";
import type { LegalBlock } from "@/data/legal";
import { fr } from "@/lib/utils";

type AnyBlock = GuideBlock | LegalBlock;

/** Rendu des blocs de contenu éditorial (guides, pages légales). */
export function Blocks({ blocks }: { blocks: AnyBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{fr(b.text)}</p>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((it) => (
                  <li key={it}>{fr(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((it) => (
                  <li key={it}>{fr(it)}</li>
                ))}
              </ol>
            );
          case "quote":
            return <blockquote key={i}>{fr(b.text)}</blockquote>;
          case "table":
            return (
              <div key={i} className="overflow-x-auto max-w-full">
                <table>
                  <thead>
                    <tr>
                      {b.headers.map((h, j) => (
                        <th key={j}>{fr(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>{fr(c)}</td>
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
