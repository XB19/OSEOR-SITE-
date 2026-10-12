import { Reveal } from './Motion';

export default function SectionHeading({ eyebrow, title, description, align = 'center', light = false, className = '' }) {
  const centered = align === 'center';
  return (
    <div className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'} mb-12 md:mb-16 ${className}`}>
      {eyebrow && (
        <Reveal y={16}>
          <span className={`eyebrow ${light ? '!text-white/90 before:!bg-white/70' : ''}`}>{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className={`mt-4 text-3xl font-bold leading-tight text-balance md:text-4xl lg:text-[2.75rem] ${light ? '!text-white' : ''}`}>
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p className={`mt-5 text-base leading-relaxed md:text-lg ${light ? 'text-white/80' : 'text-slate-500'}`}>{description}</p>
        </Reveal>
      )}
    </div>
  );
}
