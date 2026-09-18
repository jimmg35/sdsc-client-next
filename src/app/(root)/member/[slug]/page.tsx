import SelectedPublicationCard from '@/components/Members/SelectedPublicationCard';
import Avatar from '@/components/Utility/Avatar';
import { markdownToHTML } from '@/lib/md';
import {
  MemberEducation,
  MemberProfExp,
  MemberPublication,
  getAllMembers,
  getMemberBiograpgyById,
  getMemberById
} from '@/lib/members';
import { ArrowLeft, FileDown, GraduationCap, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = Promise<{
  slug: string;
}>;

const RULE = 'border-silk-600/25';

export async function generateStaticParams() {
  const members = getAllMembers();
  return members.map((member) => ({ slug: member.id }));
}

export default async function ProfilePage(props: { params: Props }) {
  const { slug } = await props.params;
  const t = await getTranslations('members.profile');

  const member = getMemberById(slug);
  const biography = getMemberBiograpgyById(slug);

  if (!member) {
    notFound();
  }

  const advisorMember = member.advisorId
    ? getMemberById(member.advisorId)
    : member.advisor
      ? getAllMembers().find((mem) => mem.name === member.advisor)
      : null;
  const advisorName = advisorMember?.name || member.advisor || null;
  const advisorTitle = advisorMember?.title || null;

  const mdHtmlContent = biography ? await markdownToHTML(biography) : '';
  const hasEducation = member.education.length > 0;
  const hasExperience = member.professionalExperience.length > 0;
  const hasFocus = member.aoi.length > 0 || member.courseTaught.length > 0;
  const hasAside =
    hasEducation || hasExperience || member.honor.length > 0 || hasFocus;

  return (
    <section className="page-shell overflow-visible">
      <div className="mx-auto w-full max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <Link
          href="/member"
          className="group inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-600 transition-colors hover:text-rose-700"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          {t('back')}
        </Link>

        <header className="mt-12 flex flex-col gap-10 md:flex-row md:items-start md:gap-14">
          {/* Squared and framed, matching the director on the directory page.
              The old circle sat in a `halo` and used Avatar's default variant,
              whose ring colours no longer exist in the theme. */}
          <div className="w-full max-w-[15rem] shrink-0">
            <div className="relative w-full rounded-[2.25rem] border border-silk-600/40 bg-gradient-to-b from-silk-500/25 via-transparent to-rose-400/15 p-[0.6rem] shadow-[0_55px_95px_-58px_rgba(56,43,28,0.9)]">
              <div className="relative aspect-square w-full overflow-hidden rounded-[1.7rem] border border-silk-600/30 bg-silk-200">
                <Image
                  src={member.thumbnail}
                  alt={`${member.name} portrait`}
                  fill
                  sizes="(max-width: 768px) 15rem, 15rem"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-silk-700 md:tracking-[0.36em]">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-transparent to-silk-600/55"
              />
              {member.centerRole || t('roleFallback')}
            </p>

            <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
              {member.name}
            </h1>

            {member.title && (
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink-700 md:text-lg md:leading-9">
                {member.title}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {member.email && (
                <ProfileActionLink
                  href={`mailto:${member.email}`}
                  icon={Mail}
                  label={t('email')}
                />
              )}
              {member.googleScholar && (
                <ProfileActionLink
                  href={member.googleScholar}
                  icon={GraduationCap}
                  label={t('googleScholar')}
                  external
                />
              )}
              {member.cvPath && (
                <ProfileActionLink
                  href={member.cvPath}
                  icon={FileDown}
                  label={t('cv')}
                  external
                />
              )}
            </div>
          </div>
        </header>

        {(member.department || advisorName) && (
          <dl
            className={`mt-16 grid gap-x-12 gap-y-8 border-y ${RULE} py-8 sm:grid-cols-2`}
          >
            {member.department && (
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-silk-700">
                  {t('department')}
                </dt>
                <dd className="mt-3 text-sm leading-6 text-ink-900">
                  {member.department}
                </dd>
              </div>
            )}

            {advisorName && (
              <div>
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-silk-700">
                  {t('advisor')}
                </dt>
                <dd className="mt-3">
                  {advisorMember ? (
                    <Link
                      href={`/member/${advisorMember.id}`}
                      aria-label={t('viewProfileAria', { name: advisorName })}
                      className="group -mx-3 inline-flex items-center gap-4 rounded-2xl px-3 py-2 transition-colors duration-300 hover:bg-rose-50/55"
                    >
                      <Avatar
                        src={advisorMember.thumbnail}
                        size={44}
                        alt={`${advisorName} portrait`}
                        variant="soft"
                        className="shrink-0 group-hover:scale-[1.04]"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ink-900 transition-colors duration-300 group-hover:text-rose-600">
                          {advisorName}
                        </span>
                        {advisorTitle && (
                          <span className="mt-0.5 block text-xs leading-5 text-ink-500">
                            {advisorTitle}
                          </span>
                        )}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-ink-900">
                      {advisorName}
                    </span>
                  )}
                </dd>
              </div>
            )}
          </dl>
        )}

        <div
          className={`mt-16 grid gap-16 ${
            hasAside
              ? 'lg:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.85fr)] lg:gap-14'
              : ''
          }`}
        >
          <main className="min-w-0 space-y-16">
            {mdHtmlContent && (
              <section>
                <SectionHeading title={t('biography')} />
                <div
                  className="article-prose prose prose-sm mt-6 max-w-none md:prose-base"
                  dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
                />
              </section>
            )}

            {member.selectedPublications.length > 0 && (
              <section>
                <SectionHeading
                  title={t('selectedPublications')}
                  count={member.selectedPublications.length}
                />
                <ul className="mt-6">
                  {member.selectedPublications.map((pub: MemberPublication) => (
                    <SelectedPublicationCard {...pub} key={pub.id} />
                  ))}
                </ul>
              </section>
            )}
          </main>

          {hasAside && (
            /* Divided from the main column by a single rule instead of each
               block sitting in its own card. */
            <aside
              className={`min-w-0 space-y-14 lg:border-l ${RULE} lg:pl-14`}
            >
              {(hasEducation || hasExperience) && (
                <section>
                  <SectionHeading title={t('credentials')} />
                  <div className="mt-6 space-y-8">
                    {hasEducation && (
                      <DetailGroup title={t('education')}>
                        <EducationList education={member.education} />
                      </DetailGroup>
                    )}
                    {hasExperience && (
                      <DetailGroup title={t('professionalExperience')}>
                        <ExperienceList
                          experience={member.professionalExperience}
                        />
                      </DetailGroup>
                    )}
                  </div>
                </section>
              )}

              {member.honor.length > 0 && (
                <section>
                  <SectionHeading
                    title={t('honorsAwards')}
                    count={member.honor.length}
                  />
                  <ul className="mt-6">
                    {member.honor.map((honor, idx) => (
                      <li key={idx} className={`border-t ${RULE} py-5`}>
                        <p className="text-[0.68rem] font-semibold uppercase tabular-nums tracking-[0.24em] text-rose-600">
                          {honor.year}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink-900">
                          {honor.title}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {hasFocus && (
                <section>
                  <SectionHeading title={t('focus')} />
                  <div className="mt-6 space-y-8">
                    {member.aoi.length > 0 && (
                      <DetailGroup title={t('areasOfInterest')}>
                        <ul className="flex flex-wrap gap-2">
                          {member.aoi.map((area, idx) => (
                            <li
                              key={idx}
                              className="rounded-full border border-silk-600/30 bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-ink-700"
                            >
                              {area}
                            </li>
                          ))}
                        </ul>
                      </DetailGroup>
                    )}

                    {member.courseTaught.length > 0 && (
                      <DetailGroup title={t('coursesTaught')}>
                        <ul>
                          {member.courseTaught.map((course, idx) => (
                            <li
                              key={idx}
                              className={`border-t ${RULE} py-4 text-sm leading-6 text-ink-700`}
                            >
                              {course}
                            </li>
                          ))}
                        </ul>
                      </DetailGroup>
                    )}
                  </div>
                </section>
              )}
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-silk-700">
        <span
          aria-hidden
          className="h-px w-8 bg-gradient-to-r from-transparent to-silk-600/55"
        />
        {title}
      </h2>
      {typeof count === 'number' && (
        <span className="text-[0.7rem] font-semibold tabular-nums text-ink-500">
          {count}
        </span>
      )}
    </div>
  );
}

function ProfileActionLink({
  href,
  icon: Icon,
  label,
  external = false
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}) {
  const className =
    'inline-flex items-center justify-center gap-2 rounded-full border border-rose-200/70 bg-surface/85 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-rose-600 transition hover:border-rose-300 hover:text-rose-700';

  // External targets (Scholar) and static assets (CV files under /cv) are not
  // app routes, so they use a plain anchor rather than next/link.
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <Icon size={15} />
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      <Icon size={15} />
      {label}
    </Link>
  );
}

function DetailGroup({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-rose-600">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

async function EducationList({ education }: { education: MemberEducation[] }) {
  const t = await getTranslations('members.profile');

  return (
    <ul>
      {education.map((edu, idx) => (
        <li key={idx} className={`border-t ${RULE} py-4`}>
          <p className="text-sm font-medium leading-6 text-ink-900">
            {t('degreeInField', { degree: edu.degree, field: edu.field })}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-700">
            {edu.institution}
            {edu.year ? `, ${edu.year}` : ''}
          </p>
        </li>
      ))}
    </ul>
  );
}

async function ExperienceList({ experience }: { experience: MemberProfExp[] }) {
  const t = await getTranslations('members.profile');

  return (
    <ul>
      {experience.map((item, idx) => (
        <li key={idx} className={`border-t ${RULE} py-4`}>
          <p className="text-sm font-medium leading-6 text-ink-900">
            {item.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-700">
            {item.institution}, {item.start_year}-
            {item.end_year || t('present')}
          </p>
        </li>
      ))}
    </ul>
  );
}
