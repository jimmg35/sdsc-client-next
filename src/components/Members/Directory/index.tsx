import Avatar from '@/components/Utility/Avatar';
import { MemberData } from '@/lib/members';
import { ArrowUpRight, GraduationCap, Mail } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

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
};

type MembersDirectoryProps = {
  director: MemberData | null;
  sections: MemberDirectorySection[];
  overview: OverviewMetric[];
};

type ActionVariant = 'profile' | 'scholar' | 'email';

const RULE = 'border-accent-600/25';

export default async function MembersDirectory({
  director,
  sections,
  overview
}: MembersDirectoryProps) {
  const t = await getTranslations('members.directory');

  return (
    <>
      {/* Headline figures, read as one line rather than four boxed cards. */}
      <dl
        className={`mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-y ${RULE} py-8 sm:grid-cols-4`}
      >
        {overview.map((item) => (
          /* Column-reverse so the term stays before its value in the markup
             while the figure still reads first. */
          <div key={item.label} className="flex flex-col-reverse">
            <dt className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-accent-700">
              {item.label}
            </dt>
            <dd className="text-[2.4rem] font-semibold leading-none tracking-[-0.03em] text-ink-900 tabular-nums">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <nav
        aria-label={t('browseEyebrow')}
        className={`flex flex-wrap items-center gap-x-8 gap-y-3 border-b ${RULE} py-5`}
      >
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
      </nav>

      {director && <DirectorSpotlight member={director} />}

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mt-24 scroll-mt-32 md:scroll-mt-40"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:tracking-[0.4em]">
                <span
                  aria-hidden
                  className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
                />
                {section.eyebrow}
              </p>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2.3rem] md:leading-[1.1]">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink-700 md:text-base">
                {section.description}
              </p>
            </div>

            <p className="shrink-0 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink-500 md:self-end">
              {t('memberCount', { count: section.members.length })}
            </p>
          </div>

          <div className="mt-10 grid gap-x-10 md:grid-cols-2 xl:grid-cols-3">
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
    <section id="director" className="mt-20 scroll-mt-32 md:scroll-mt-40">
      <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:tracking-[0.4em]">
        <span
          aria-hidden
          className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
        />
        {t('centerDirector')}
      </p>

      <div className="mt-10 flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
        {/* Squared and framed like the director's letter on the home page,
            rather than a circle inside a halo. No caption: `centerRole` reads
            "Center Director" here, which the section eyebrow already says. */}
        <div className="w-full max-w-[17rem] shrink-0">
          <div className="relative w-full rounded-[2.25rem] border border-accent-600/40 bg-gradient-to-b from-accent-500/25 via-transparent to-primary-400/15 p-[0.6rem] shadow-portrait">
            <div className="relative aspect-square w-full overflow-hidden rounded-[1.7rem] border border-accent-600/30 bg-accent-200">
              <Image
                src={member.thumbnail}
                alt={`${member.name} portrait`}
                fill
                sizes="(max-width: 768px) 17rem, 17rem"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-3xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2.5rem] md:leading-[1.1]">
            {member.name}
          </h3>
          {member.title && (
            <p className="mt-5 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
              {member.title}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink
              href={`/member/${member.id}`}
              label={t('viewProfile')}
              variant="profile"
              primary
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
            <div className={`mt-10 border-t ${RULE} pt-8`}>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-accent-700">
                {t('selectRecognition')}
              </p>
              <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
                {member.honor.slice(0, 4).map((honor) => (
                  <li
                    key={`${honor.title}-${honor.year}`}
                    className={`border-t ${RULE} py-4`}
                  >
                    <p className="text-sm font-medium leading-6 text-ink-900">
                      {honor.title}
                    </p>
                    <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] tabular-nums text-primary-600">
                      {honor.year}
                    </p>
                  </li>
                ))}
              </ul>
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
    /* No card chrome: a ruled cell that tints on hover, so twenty-two people
       read as one directory instead of twenty-two floating boxes. */
    <Link
      href={`/member/${member.id}`}
      className={`group -mx-4 flex h-full gap-5 border-t ${RULE} px-4 py-6 transition-colors duration-300 hover:bg-primary-50/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70`}
    >
      <Avatar
        src={member.thumbnail}
        size={72}
        alt={`${member.name} portrait`}
        variant="soft"
        className="shrink-0 self-start group-hover:scale-[1.04]"
      />

      <div className="min-w-0 flex-1">
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-primary-600">
          {member.centerRole || t('memberRoleFallback')}
        </p>
        <h3 className="mt-2 text-lg font-medium leading-snug tracking-[-0.01em] text-ink-900 transition-colors duration-300 group-hover:text-primary-600">
          {member.name}
        </h3>
        {member.title && (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-700">
            {member.title}
          </p>
        )}
        {member.advisor && (
          <p className="mt-3 text-xs leading-5 text-ink-500">
            <span className="font-semibold uppercase tracking-[0.18em] text-accent-700">
              {t('advisor')}
            </span>{' '}
            {member.advisor}
          </p>
        )}
      </div>

      <ArrowUpRight
        size={16}
        aria-hidden
        className="mt-1 shrink-0 text-ink-500 opacity-0 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-600 group-hover:opacity-100"
      />
    </Link>
  );
}

function ActionLink({
  href,
  label,
  variant,
  external = false,
  primary = false
}: {
  href: string;
  label: string;
  variant: ActionVariant;
  external?: boolean;
  primary?: boolean;
}) {
  const tone = primary
    ? 'border-primary-400/70 bg-primary-500/90 text-white hover:bg-primary-600'
    : 'border-primary-200/70 bg-surface/85 text-primary-600 hover:border-primary-300 hover:text-primary-700';

  return (
    <Link
      href={href}
      {...(external
        ? {
            target: '_blank',
            rel: 'noreferrer noopener'
          }
        : {})}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] transition ${tone}`}
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
      className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-ink-500 transition-colors hover:text-primary-600"
    >
      {label}
    </Link>
  );
}
