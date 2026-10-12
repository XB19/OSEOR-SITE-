import Hero from '../sections/Hero';
import { Bandeau, Stats, Expertises, Secteurs } from '../sections/Intro';
import { Participations, Projets, Pourquoi } from '../sections/Portfolio';
import CTABanner from '../components/CTABanner';

export default function Home() {
  return (
    <>
      <Hero />
      <Bandeau />
      <Stats />
      <Expertises />
      <Secteurs />
      <Participations />
      <Projets />
      <Pourquoi />
      <CTABanner />
    </>
  );
}
