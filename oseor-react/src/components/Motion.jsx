import { motion } from 'framer-motion';

export const EASE = [0.22, 1, 0.36, 1];

/** Apparition au scroll (remplace AOS du projet d'origine). */
export function Reveal({ children, delay = 0, y = 32, x = 0, scale = 1, className = '', as = 'div', ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

const container = (stagger, delay) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Conteneur qui fait apparaître ses <StaggerItem> les uns après les autres. */
export function Stagger({ children, className = '', stagger = 0.1, delay = 0, as = 'div' }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className = '', as = 'div', ...rest }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={itemVariants} {...rest}>
      {children}
    </Comp>
  );
}

/** Enveloppe de page : transition à l'entrée / sortie de route. */
export function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
