import {
  BrainCircuit,
  Globe2,
  LineChart,
  MapPinned,
  Network,
  Sparkles
} from 'lucide-react';

const pillars = [
  {
    title: 'Spatial Thinking',
    description:
      'We champion spatial reasoning as a lens for decoding global and local challenges, empowering communities to see patterns others miss.',
    icon: Globe2
  },
  {
    title: 'Data-Driven Insight',
    description:
      'From exploratory analytics to deployable models, our teams pair spatial statistics with machine learning to unlock trusted intelligence.',
    icon: LineChart
  },
  {
    title: 'Place Matters',
    description:
      'We keep human context at the center of every project, translating geospatial signals into equitable, actionable strategies.',
    icon: MapPinned
  }
];

const initiatives = [
  {
    title: 'Interdisciplinary Studios',
    description:
      'Immersive sprints that bring together visualization, policy, and field expertise to prototype solutions in weeks, not months.',
    icon: Network
  },
  {
    title: 'AI-Ready Spatial Infrastructure',
    description:
      'Modern data pipelines, dynamic geodatabases, and reproducible notebooks that keep SDSC research ready for production deployment.',
    icon: BrainCircuit
  },
  {
    title: 'Community Impact Labs',
    description:
      'Partnerships with agencies and nonprofits that translate research into outreach, workforce training, and decision support.',
    icon: Sparkles
  }
];

export default function About() {
  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="text-center text-ink-900">
          <span className="chip-gold">About SDSC</span>
          <h1 className="mt-6 text-4xl font-semibold text-garnet-800 text-glow md:text-5xl">
            Spatial intelligence for real-world change
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-ink-600 md:text-base">
            The Spatial Data Science Center at Florida State University fuses
            geographic information science, advanced analytics, and
            human-centered design to build tools that serve communities. We
            connect faculty, students, and partners around research that scales
            from insight to impact.
          </p>
        </header>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="glass-card flex flex-col gap-4 px-6 py-8 text-ink-900"
            >
              <div className="flex items-center gap-3 text-garnet-600">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-garnet-200/70 bg-gold-100/80">
                  <Icon size={24} />
                </div>
                <h2 className="text-lg font-semibold text-garnet-800">
                  {title}
                </h2>
              </div>
              <p className="text-sm leading-6 text-ink-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 grid gap-8 md:grid-cols-[1.3fr_1fr]">
          <article className="surface-fade px-8 py-10 text-ink-900">
            <h2 className="panel-title text-garnet-500">Our Mission</h2>
            <p className="mt-6 text-sm leading-7 text-ink-600 md:text-base">
              SDSC&apos;s mission is to advance spatial data science that is
              transparent, inclusive, and ready for deployment. We push the
              frontier of geospatial modeling while mentoring the next
              generation of scientists ready to collaborate beyond disciplinary
              lines.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink-600 md:text-base">
              From immersive analytics environments to AI-augmented workflows,
              we prototype experiences that make complex spatial knowledge
              accessible for decision makers and residents alike.
            </p>
          </article>

          <article className="glass-card px-6 py-8 text-ink-900">
            <h3 className="panel-title text-garnet-500">At a Glance</h3>
            <ul className="mt-6 space-y-4 text-sm text-ink-600">
              <li className="custom-li">
                20+ cross-college collaborators and growing
              </li>
              <li className="custom-li">
                Award-winning faculty leading global spatial initiatives
              </li>
              <li className="custom-li">
                Studio model that pairs education with live community projects
              </li>
              <li className="custom-li">
                Open-source tooling and MGWR platform maintained by SDSC
              </li>
            </ul>
          </article>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {initiatives.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="glass-card flex flex-col gap-4 px-6 py-8 text-ink-900"
            >
              <div className="flex items-center gap-3 text-garnet-600">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-garnet-200/70 bg-white/80">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-garnet-800">
                  {title}
                </h3>
              </div>
              <p className="text-sm leading-6 text-ink-600">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
