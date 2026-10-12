/** Logo OSEOR recadré (le PNG d'origine est carré avec beaucoup de marge). */
export default function Logo({ className = 'h-14' }) {
  return (
    <span className={`block aspect-[1.35] overflow-hidden ${className}`}>
      <img src="/assets/images/logo.png" alt="OSEOR SA" className="h-full w-full object-cover" />
    </span>
  );
}
