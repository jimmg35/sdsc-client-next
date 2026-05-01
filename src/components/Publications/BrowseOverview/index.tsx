export type PublicationOverviewMetric = {
  value: string;
  label: string;
  detail?: string;
};

type PublicationBrowseOverviewProps = {
  overview: PublicationOverviewMetric[];
  linkedContributorCount: number;
  latestYear: number | null;
};

export default function PublicationBrowseOverview({
  overview,
  linkedContributorCount,
  latestYear
}: PublicationBrowseOverviewProps) {
  return (
    <section className="surface-fade mb-16 mt-10 overflow-hidden px-6 py-8 md:mt-12 md:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_84%_-12%,_rgba(168,110,161,0.24),_transparent_55%),radial-gradient(110%_110%_at_12%_-16%,_rgba(194,156,106,0.22),_transparent_52%)]" />

      <div className="relative">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,1fr)] lg:items-end">
          <div>
            <p className="panel-title text-gold-300">Browse The Archive</p>
            <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
              Navigate SDSC scholarship before you drop into the full finder
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-gold-200/78 md:text-base">
              Start with the live finder, then tighten the archive by year, SDSC
              contributor, or the results stream itself. The current index
              {latestYear ? ` reaches into ${latestYear}` : ' is live'} and
              already connects {linkedContributorCount} SDSC member profiles
              back to publication cards.
            </p>
          </div>

          <div className="grid gap-3">
            {overview.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-rose-100/75 bg-white/78 px-5 py-5 text-ink-900 shadow-[0_20px_44px_-34px_rgba(61,47,39,0.35)]"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-rose-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-rose-700">
                  {item.value}
                </p>
                {item.detail && (
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
