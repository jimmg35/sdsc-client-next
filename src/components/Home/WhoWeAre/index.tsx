import { Fade } from 'react-awesome-reveal';
import Image from 'next/image';

const WhoWeAre = () => {
  return (
    <section className="surface-fade relative w-full overflow-hidden px-4 py-16 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_-10%,_rgba(124,74,158,0.35),_transparent_55%),_radial-gradient(110%_110%_at_80%_-15%,_rgba(189,156,99,0.28),_transparent_60%)]" />
      <Fade direction="up" duration={500} cascade triggerOnce>
        <div className="relative flex flex-col items-center text-center text-gold-100">
          <h1 className="text-4xl font-semibold tracking-tight text-gold-50 md:text-6xl">
            Who We Are
          </h1>
          <p className="mt-4 max-w-3xl text-base text-gold-200/80 md:text-xl">
            The Spatial Data Science Center is a studio for high-impact
            geospatial research, immersive design, and open-source tooling that
            empowers partners to understand place at every scale.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <Image
              src="/img/compass-banner.jpg"
              width={800}
              height={411}
              alt="Compass visualization"
              className="rounded-3xl border border-garnet-500/30 shadow-[0_34px_68px_-42px_rgba(9,4,24,0.8)]"
            />
          </div>
          <p className="mt-8 max-w-2xl text-base font-semibold uppercase tracking-[0.26em] text-gold-200/80">
            Empowering spatial understanding through avant-garde GIScience
            research.
          </p>
        </div>
      </Fade>
    </section>
  );
};

export default WhoWeAre;
