/**
 * Rejoué à chaque navigation : fondu d'entrée de la page et, en haut à droite,
 * le filigrane d'alvéoles dorées de la marque (classes définies dans globals.css).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter">
      <div aria-hidden className="hex-lines page-hex" />
      {children}
    </div>
  );
}
