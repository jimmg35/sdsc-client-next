import {
  Building2,
  Bus,
  Earth,
  HeartPlus,
  ShieldAlert,
  SquaresExclude,
  Vote
} from 'lucide-react';

const focusAreas = [
  {
    title: 'Spatial Analytics',
    description:
      'To advance spatial statistical and AI methods to better understand spatial processes and enable accurate prediction.',
    icon: SquaresExclude
  },
  {
    title: 'Health & Wellbeing',
    description:
      'We use of spatial data and mixed methods to analyze geographic patterns in health outcomes, risks, and healthcare access for better decision-making and prediction.',
    icon: HeartPlus
  },
  {
    title: 'Environment',
    description:
      'To monitor, model, and predict environmental changes and natural hazards, and assess their impacts on ecosystems and communities.',
    icon: Earth
  },
  {
    title: 'Voting',
    description:
      'To investigate spatial patterns of voter behavior, electoral processes, and participation disparities.',
    icon: Vote
  },
  {
    title: 'Urban',
    description:
      'To explore how urban systems, spatial dynamics, and governance influence equity and resilience in cities.',
    icon: Building2
  },
  {
    title: 'Transportation',
    description:
      'To understand travel behavior, enhance mobility systems, and advance equitable and sustainable transportation solutions.',
    icon: Bus
  },
  {
    title: 'Crime',
    description:
      'To examine crime dynamics, neighborhood contexts, and social inequities shaping public safety.',
    icon: ShieldAlert
  }
];

// const spotlights = [
//   {
//     title: 'Immersive Analytics Lab',
//     description:
//       'Extends spatial reasoning into XR environments so decision makers can interact with live models and simulations.',
//     icon: Orbit
//   },
//   {
//     title: 'GeoAI Resilience Studio',
//     description:
//       'Combines AI, Earth observation, and socio-economic data to support climate resilience and equitable planning.',
//     icon: GlobeLock
//   },
//   {
//     title: 'Spatial DevOps',
//     description:
//       'Production pipelines, automated testing, and deployment strategies for reproducible spatial science at scale.',
//     icon: Layers3
//   }
// ];

export default function Research() {
  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 text-ink-900 md:pt-40">
        <header className="text-center">
          <span className="chip-gold">Research</span>
          <h1 className="mt-6 text-4xl font-semibold text-black text-glow md:text-5xl">
            Advancing spatial knowledge and practice
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-ink-600 md:text-base">
            SDSC research pairs rigorous methodology with responsive design. Our
            labs translate emerging spatial theory into tools that stakeholders
            can deploy in cities, ecosystems, and virtual environments.
          </p>
        </header>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {focusAreas.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="glass-card flex flex-col gap-4 px-6 py-8 text-ink-900"
            >
              <div className="flex items-center gap-3 text-black">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-garnet-500/40 bg-[#160b29]/10">
                  <Icon size={24} />
                </div>
                <h2 className="text-lg font-semibold text-black text-glow">
                  {title}
                </h2>
              </div>
              <p className="text-sm leading-6 text-ink-600">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 grid gap-8 md:grid-cols-[1.3fr_1fr] text-ink-900">
          <article className="surface-fade px-8 py-10">
            <h2 className="panel-title text-black">Methodology</h2>
            <p className="mt-6 text-sm leading-7 text-ink-600 md:text-base">
              We approach every research question with a balance of
              computational experimentation, theoretical rigor, and co-design
              with domain experts. Our projects span quantitative modeling,
              qualitative insights, and participatory design to ensure outputs
              travel from manuscript to policy.
            </p>
            <p className="mt-4 text-sm leading-7 text-ink-600 md:text-base">
              Faculty and graduate researchers collaborate through living
              documentation, shared data catalogs, and reproducible pipelines.
              The result is science that is easy to understand, extend, and
              deploy beyond the lab.
            </p>
          </article>

          <article className="glass-card px-6 py-8 text-ink-900">
            <h3 className="panel-title text-gold-300">Core capabilities</h3>
            <ul className="mt-6 space-y-4 text-sm text-ink-600">
              <li className="custom-li">
                Spatial econometrics and local inference
              </li>
              <li className="custom-li">
                GeoAI model development and evaluation
              </li>
              <li className="custom-li">
                Immersive visualization and UX research
              </li>
              <li className="custom-li">
                Open-source software engineering for geospatial analytics
              </li>
            </ul>
          </article>
        </section>

        {/* <section className="mt-20 grid gap-6 md:grid-cols-3">
          {spotlights.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="glass-card flex flex-col gap-4 px-6 py-8 text-ink-900"
            >
              <div className="flex items-center gap-3 text-black">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-garnet-500/40 bg-[#160b29]/10">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-black text-glow">
                  {title}
                </h3>
              </div>
              <p className="text-sm leading-6 text-ink-600">{description}</p>
            </article>
          ))}
        </section> */}
      </div>
    </section>
  );
}
