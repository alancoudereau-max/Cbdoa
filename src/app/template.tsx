/** Rejoué à chaque navigation : fondu d'entrée de la page (classe définie dans globals.css). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
