import { Fade } from 'react-awesome-reveal';
import Link from 'next/link';

const Announcement = () => {
  return (
    <section className="surface-fade rounded-none relative w-full overflow-hidden px-4 py-16 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_-20%,_rgba(255,126,95,0.35),_transparent_55%),_radial-gradient(130%_130%_at_85%_-15%,_rgba(255,215,141,0.35),_transparent_65%)]" />

      <div className="relative flex flex-col items-center text-center text-gold-50">
        <Fade direction="up" duration={800} cascade triggerOnce>
          <h1 className="relative mt-10 flex flex-col items-center text-center text-balance text-4xl font-black tracking-tight text-gold-50 md:text-6xl">
            <span className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-1 text-sm font-bold uppercase tracking-[0.55em] text-gold-100/90 shadow-[0_18px_45px_-28px_rgba(0,0,0,0.8)] md:text-xs">
              Faculty Hire
            </span>
            <span className="relative mt-5 inline-flex items-center">
              <span className="text-black">
                Two Tenure-Track Positions Open
              </span>
            </span>
            <span className="mt-4 flex items-center gap-3 text-base uppercase tracking-[0.4em] text-gold-200/70 md:text-lg">
              Join · Lead · Inspire
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base text-gold-100/80 md:text-xl">
            SDSC is hiring two tenure-track assistant professors in any area of
            spatial data science (e.g., GeoAI, spatial statistics, health,
            transportation, urban, crime, voting, environment, etc.). The
            candidate will have an academic home in one of the departments
            (Geography, Urban and Regional Planning, Economics, Political
            Science, Public Administration, Sociology) of the College of Social
            Sciences & Public Policy at FSU.
            <br />
            Application review begins December 1, 2025.
          </p>

          {/*
          <div className="glass-card mt-10 w-full max-w-3xl rounded-3xl py-4 px-8">
            <p className="text-lg font-semibold text-gold-50/90">
              What we&apos;re looking for
            </p>
            <ul className="mt-4 space-y-3 text-base text-gold-100/80">
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                <span>
                  Visionary faculty eager to lead research across GIScience,
                  geospatial AI, and spatial analytics.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                <span>
                  Educators committed to mentoring the next generation of
                  spatial data scientists.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                <span>
                  Partners ready to invest in open, community-driven spatial
                  tooling.
                </span>
              </li>
            </ul>
          </div>
          */}
          <Link
            href="/announcements/now-hiring-tenure-track-faculty"
            className="w-240 mt-12 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-base font-semibold text-white transition-all duration-300 bg-[length:300%_100%] bg-[position:0_0] bg-[linear-gradient(to_right,_#6253e1,_#852d91,_#a3a1ff,_#f24645)] shadow-[0_4px_15px_rgba(126,52,161,0.75)] hover:-translate-y-0.5 hover:bg-[position:100%_0] hover:shadow-[0_6px_20px_rgba(126,52,161,0.6)] focus:outline-none focus:ring-2 focus:ring-[#a3a1ff] focus:ring-offset-2 focus:ring-offset-garnet-900"
          >
            See more details &rarr;
          </Link>
        </Fade>
      </div>
    </section>
  );
};

export default Announcement;
