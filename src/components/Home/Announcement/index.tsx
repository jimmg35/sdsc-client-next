import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';

const Announcement = () => {
  return (
    <section className="surface-fade rounded-none relative w-full overflow-hidden px-4 py-16 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_-20%,_rgba(255,126,95,0.35),_transparent_55%),_radial-gradient(130%_130%_at_85%_-15%,_rgba(255,215,141,0.35),_transparent_65%)]" />
      <Fade direction="up" duration={500} cascade triggerOnce>
        <div className="relative flex flex-col items-center text-center text-gold-50">
          <span className="rounded-full bg-garnet-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-gold-50">
            Now Hiring
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Two Tenure-Track Positions Open
          </h1>
          <p className="mt-6 max-w-3xl text-base text-gold-100/80 md:text-xl">
            Help steer the Spatial Data Science Center as we expand our
            high-impact research in geospatial analytics, immersive design, and
            open-source tooling. We are searching for bold scholars ready to
            shape the future of GIScience.
          </p>
          <div className="mt-10 w-full max-w-3xl rounded-3xl border border-gold-50/30 bg-garnet-900/40 p-8 text-left shadow-[0_30px_60px_-32px_rgba(0,0,0,0.6)] backdrop-blur">
            <p className="text-lg font-semibold text-gold-50/90">
              What we&apos;re looking for
            </p>
            <ul className="mt-4 space-y-3 text-base text-gold-100/80">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gold-200" />
                <span>
                  Visionary faculty eager to lead collaborative research across
                  GIScience, geospatial AI, and spatial analytics.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gold-200" />
                <span>
                  Educators committed to mentoring the next generation of
                  spatial data scientists.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-gold-200" />
                <span>
                  Partners ready to invest in open, community-driven spatial
                  tooling.
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-gold-50 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-garnet-700 shadow-[0_20px_40px_-16px_rgba(255,215,141,0.5)] transition hover:-translate-y-1 hover:bg-white"
            >
              Share Your CV
            </Link>
            <Link
              href="/news"
              className="rounded-full border border-gold-200/60 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-gold-100 transition hover:-translate-y-1 hover:border-gold-100"
            >
              View Full Details
            </Link>
          </div>
        </div>
      </Fade>
    </section>
  );
};

export default Announcement;
