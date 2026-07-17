import Avatar from '@/components/Utility/Avatar';
import { Link } from '@/i18n/navigation';
import { MemberData } from '@/lib/members';
import { ArrowUpRight, GraduationCap, Mail, UsersRound } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export type MemberDirectorySection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  members: MemberData[];
};

type OverviewMetric = {
  value: string;
  label: string;
  detail: string;
};

type MembersDirectoryProps = {
  director: MemberData | null;
  sections: MemberDirectorySection[];
  overview: OverviewMetric[];
};

type ActionVariant = 'profile' | 'scholar' | 'email';

export default async function MembersDirectory({
  director,
  sections,
  overview
}: MembersDirectoryProps) {
  const t = await getTranslations('members.directory');

  return (
    <>
      <section className="surface-fade mb-16 overflow-hidden px-6 py-8 md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_84%_-12%,_rgba(168,110,161,0.24),_transparent_55%),radial-gradient(110%_110%_at_12%_-16%,_rgba(194,156,106,0.22),_transparent_52%)]" />

        <div className="relative">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,1fr)] lg:items-end">
            <div>
              <p className="panel-title text-gold-300">{t('browseEyebrow')}</p>
              <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
                {t('browseTitle')}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gold-200/78 md:text-base">
                {t('browseDescription')}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {director && (
                  <AnchorLink href="#director" label={t('centerDirector')} />
                )}
                {sections.map((section) => (
                  <AnchorLink
                    key={section.id}
                    href={`#${section.id}`}
                    label={section.title}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {overview.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-rose-100/75 bg-surface/78 px-5 py-5 text-ink-900 shadow-[0_20px_44px_-34px_rgba(61,47,39,0.35)]"
                >
                  <p className="text-3xl font-semibold text-rose-700">
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-600">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {director && <DirectorSpotlight member={director} />}

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="surface-fade mb-12 scroll-mt-36 px-6 py-10 md:px-10 md:scroll-mt-44"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="panel-title text-gold-300">{section.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
                {section.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-surface/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
                <UsersRound size={14} />
                {t('memberCount', { count: section.members.length })}
              </div>
              <div className="inline-flex items-center rounded-full border border-gold-400/35 bg-gold-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-100">
                {t('sortedAZ')}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {section.members.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

async function DirectorSpotlight({ member }: { member: MemberData }) {
  const t = await getTranslations('members.directory');

  return (
    <section
      id="director"
      className="surface-fade mb-16 scroll-mt-36 px-6 py-10 md:px-10 md:scroll-mt-44"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="panel-title text-gold-300">{t('centerDirector')}</p>
          <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
            {t('spotlightTitle')}
          </h2>
        </div>
        <div className="inline-flex items-center self-start whitespace-nowrap rounded-full border border-rose-200/70 bg-surface/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
          {t('spotlightBadge')}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <div className="glass-card px-6 py-8 text-center">
          <div className="flex justify-center">
            <span className="halo">
              <Avatar
                src={member.thumbnail}
                size={220}
                alt={`${member.name} portrait`}
              />
            </span>
          </div>
          <span className="chip-gold mt-6">
            {member.centerRole || t('directorRoleFallback')}
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.26em] text-gold-300/75">
            {t('spatialDataScienceCenter')}
          </p>
        </div>

        <div className="glass-card px-6 py-8 md:px-8">
          <div className="max-w-3xl">
            <h3 className="text-3xl font-semibold text-gold-50 text-glow">
              {member.name}
            </h3>
            {member.title && (
              <p className="mt-3 text-base leading-7 text-gold-200/82">
                {member.title}
              </p>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink
              href={`/member/${member.id}`}
              label={t('viewProfile')}
              variant="profile"
            />
            {member.googleScholar && (
              <ActionLink
                href={member.googleScholar}
                label={t('scholar')}
                variant="scholar"
                external
              />
            )}
            {member.email && (
              <ActionLink
                href={`mailto:${member.email}`}
                label={t('email')}
                variant="email"
              />
            )}
          </div>

          {member.honor.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold-300/70">
                {t('selectRecognition')}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {member.honor.slice(0, 4).map((honor) => (
                  <div
                    key={`${honor.title}-${honor.year}`}
                    className="rounded-[20px] border border-rose-100/70 bg-surface/70 px-4 py-4 text-sm leading-6 text-ink-700"
                  >
                    <p className="font-semibold text-ink-900">{honor.title}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                      {honor.year}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

async function MemberCard({ member }: { member: MemberData }) {
  const t = await getTranslations('members.directory');

  return (
    <Link
      href={`/member/${member.id}`}
      className="group glass-card flex h-full flex-col px-5 py-5 text-gold-100 transition duration-300 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400/80"
    >
      <div className="flex items-start gap-4">
        <span className="halo shrink-0">
          <Avatar
            src={member.thumbnail}
            size={88}
            alt={`${member.name} portrait`}
            variant="soft"
          />
        </span>
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-rose-500">
            {member.centerRole || t('memberRoleFallback')}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-gold-50 text-glow">
            {member.name}
          </h3>
          {member.title && (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-gold-200/80">
              {member.title}
            </p>
          )}
        </div>
      </div>

      {member.advisor && (
        <div className="mt-3 w-full border-t border-white/10 pt-3">
          <p className="text-sm leading-6 text-gold-200/78">
            <span className="font-semibold text-gold-300/82">
              {t('advisor')}
            </span>{' '}
            {member.advisor}
          </p>
        </div>
      )}
    </Link>
  );
}

function ActionLink({
  href,
  label,
  variant,
  external = false
}: {
  href: string;
  label: string;
  variant: ActionVariant;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external
        ? {
            target: '_blank',
            rel: 'noreferrer noopener'
          }
        : {})}
      className="inline-flex items-center gap-2 rounded-full border border-gold-400/35 bg-gold-500/15 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-gold-100 transition hover:bg-gold-500/28"
    >
      {variant === 'scholar' ? (
        <GraduationCap size={15} />
      ) : variant === 'email' ? (
        <Mail size={15} />
      ) : (
        <ArrowUpRight size={15} />
      )}
      {label}
    </Link>
  );
}

function AnchorLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-rose-200/70 bg-surface/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
    >
      {label}
    </Link>
  );
}
