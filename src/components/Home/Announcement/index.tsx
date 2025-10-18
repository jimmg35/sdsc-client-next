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
          <div className="glass-card mt-10 w-full max-w-3xl rounded-3xl">
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
          <Link
            href="/announcements/now-hiring-tenure-track-faculty"
            className="w-240 mt-12 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white transition-all duration-300 bg-[length:300%_100%] bg-[position:0_0] bg-[linear-gradient(to_right,_#25aae1,_#40e495,_#30dd8a,_#2bb673)] shadow-[0_4px_15px_rgba(49,196,190,0.45)] hover:-translate-y-0.5 hover:bg-[position:100%_0] hover:shadow-[0_6px_20px_rgba(49,196,190,0.6)] focus:outline-none focus:ring-2 focus:ring-[#40e495] focus:ring-offset-2 focus:ring-offset-garnet-900"
          >
            Apply To Lead &rarr;
          </Link>
        </div>
      </Fade>
    </section>
  );
};

export default Announcement;
