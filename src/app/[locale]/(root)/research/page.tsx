import {
  Building2,
  Bus,
  Earth,
  HeartPlus,
  ShieldAlert,
  SquaresExclude,
  Vote
} from 'lucide-react';
import Image from 'next/image';

const focusAreas = [
  {
    title: 'Spatial Analytics',
    description:
      'Advance spatial statistical and AI methods to better understand spatial processes and enable accurate prediction.',
    icon: SquaresExclude
  },
  {
    title: 'Health & Wellbeing',
    description:
      'Analyze geographic patterns in health outcomes, risks, and healthcare access for better decision-making and prediction.',
    icon: HeartPlus
  },
  {
    title: 'Environment',
    description:
      'Monitor, model, and predict environmental changes and natural hazards, and assess their impacts on ecosystems and communities.',
    icon: Earth
  },
  {
    title: 'Voting',
    description:
      'Mesaure spatial patterns of voter behavior, electoral processes, and participation disparities.',
    icon: Vote
  },
  {
    title: 'Urban',
    description:
      'Explore how urban systems, mobility and spatial dynamics influence equity and resilience in cities.',
    icon: Building2
  },
  {
    title: 'Transportation',
    description:
      'Understand travel behavior, enhance mobility systems, and advance equitable and sustainable transportation solutions.',
    icon: Bus
  },
  {
    title: 'Crime',
    description:
      'Examine crime dynamics, neighborhood contexts, and social inequities shaping public safety.',
    icon: ShieldAlert
  }
];

const iconPositions = [
  'left-[12%] top-[15%]',
  'right-[12%] top-[12%]',
  'left-[46%] top-[35%]',
  'left-[16%] bottom-[16%]',
  'right-[14%] bottom-[18%]',
  'left-[58%] bottom-[38%]',
  'left-[34%] top-[4%]'
];

const cardLayouts = [
  'lg:col-span-6 lg:p-8',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-3'
];

export default function Research() {
  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-28 text-ink-900 md:pt-36">
        <header className="relative min-h-[31rem] overflow-hidden rounded-[30px] border border-white/45 shadow-[0_48px_90px_-58px_rgba(44,36,32,0.72)]">
          <Image
            src="/img/banners/research-banner.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(44,36,32,0.94)_0%,_rgba(44,36,32,0.78)_42%,_rgba(44,36,32,0.28)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(253,250,244,0)_0%,_rgba(253,250,244,0.16)_100%)]" />

          <div className="relative grid min-h-[31rem] grid-cols-1 items-center gap-8 px-6 py-12 md:px-10 lg:grid-cols-[minmax(0,1fr)_28rem]">
            <div className="min-w-0 max-w-2xl">
              <span className="chip-gold border-white/35 bg-white/88 text-rose-700">
                Research
              </span>
              <h1 className="mt-6 text-4xl font-semibold text-white text-glow md:text-5xl">
                Advancing spatial knowledge and practice
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/82 md:text-base">
                The Spatial Data Science Center (SDSC) is committed to
                developing solutions to some of society&apos;s most pressing
                problems in areas such as health, transportation, crime, poverty
                and the environment through the power of spatial data analytics.
              </p>
            </div>

            <div
              className="relative hidden min-h-[24rem] lg:block"
              aria-hidden="true"
            >
              <div className="absolute inset-0 rounded-[28px] border border-white/16 bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md [background-image:linear-gradient(rgba(255,255,255,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.13)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="absolute left-[22%] top-[29%] h-px w-[58%] rotate-6 bg-white/28" />
              <div className="absolute bottom-[32%] left-[19%] h-px w-[60%] -rotate-12 bg-white/22" />
              <div className="absolute left-[50%] top-[15%] h-[68%] w-px rotate-12 bg-white/20" />

              {focusAreas.map(({ title, icon: Icon }, index) => (
                <div
                  key={title}
                  className={`absolute flex h-14 w-14 items-center justify-center rounded-2xl border border-white/25 bg-white/16 text-white shadow-[0_24px_48px_-32px_rgba(0,0,0,0.65)] backdrop-blur-md ${iconPositions[index]}`}
                >
                  <Icon size={25} />
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-12 grid grid-cols-1 auto-rows-fr gap-5 lg:grid-cols-12 lg:auto-rows-[minmax(12rem,auto)]">
          {focusAreas.map(({ title, description, icon: Icon }, index) => (
            <article
              key={title}
              className={`group relative min-w-0 overflow-hidden rounded-[24px] border border-rose-100/75 bg-white/82 px-6 py-7 text-ink-900 shadow-[0_34px_70px_-52px_rgba(44,36,32,0.5)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-rose-200 hover:bg-white/92 ${cardLayouts[index] || 'lg:col-span-4'}`}
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-500/75 via-silk-500/75 to-transparent opacity-80" />
              {index === 0 && (
                <Icon
                  aria-hidden="true"
                  size={140}
                  strokeWidth={1.15}
                  className="pointer-events-none absolute -bottom-8 -right-6 hidden text-rose-100/75 lg:block"
                />
              )}
              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-200/70 bg-rose-50 text-rose-700 transition duration-300 group-hover:border-rose-300 group-hover:bg-rose-100">
                    <Icon size={23} />
                  </div>
                  <div className="min-w-0">
                    <h2
                      className={
                        index === 0
                          ? 'text-2xl font-semibold text-ink-900 text-glow md:text-3xl'
                          : 'text-lg font-semibold text-ink-900 text-glow'
                      }
                    >
                      {title}
                    </h2>
                    <p
                      className={
                        index === 0
                          ? 'mt-4 text-sm leading-7 text-ink-600 md:text-base'
                          : 'mt-3 text-sm leading-6 text-ink-600'
                      }
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
