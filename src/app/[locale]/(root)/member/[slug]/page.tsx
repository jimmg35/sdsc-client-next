import SelectedPublicationCard from '@/components/Members/SelectedPublicationCard';
import Avatar from '@/components/Utility/Avatar';
import { Link } from '@/i18n/navigation';
import { markdownToHTML } from '@/lib/md';
import {
  MemberEducation,
  MemberProfExp,
  MemberPublication,
  getAllMembers,
  getMemberBiograpgyById,
  getMemberById
} from '@/lib/members';
import {
  ArrowLeft,
  Award,
  BookOpen,
  BriefcaseBusiness,
  FileDown,
  GraduationCap,
  Mail,
  MapPin,
  Sparkles,
  UserRound
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = Promise<{
  locale: string;
  slug: string;
}>;

export async function generateStaticParams() {
  const members = getAllMembers();
  return members.map((member) => ({ slug: member.id }));
}

export default async function ProfilePage(props: { params: Props }) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);
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

  return (
    <section className="member-profile-page page-shell overflow-visible">
      <div className="mx-auto w-full max-w-6xl px-5 pb-24 pt-32 text-ink-900 md:px-6 md:pt-36">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-600 shadow-[0_18px_42px_-30px_rgba(168,110,161,0.28)] transition hover:border-rose-300 hover:bg-white hover:text-rose-700"
          href="/member"
        >
          <ArrowLeft size={15} />
          {t('back')}
        </Link>

        <header className="surface-fade mt-6 overflow-hidden px-6 py-8 md:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[13rem_1fr] lg:items-center">
            <div className="flex flex-col items-center justify-self-center text-center">
              <div className="halo">
                <Avatar
                  src={member.thumbnail}
                  size={172}
                  alt={`${member.name} portrait`}
                />
              </div>
              <span className="mt-5 inline-flex whitespace-nowrap rounded-full border border-rose-200/80 bg-rose-50/80 px-3 py-1 text-center text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-rose-600">
                {member.centerRole || t('roleFallback')}
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="text-4xl font-semibold leading-tight text-ink-900 md:text-5xl">
                {member.name}
              </h1>
              {member.title && (
                <p className="mt-4 max-w-3xl text-base leading-7 text-ink-700/84 md:text-lg">
                  {member.title}
                </p>
              )}

              <div className="mt-6 grid gap-3 text-sm text-ink-700/82 md:grid-cols-2">
                {member.department && (
                  <ProfileMeta icon={MapPin} label={t('department')}>
                    {member.department}
                  </ProfileMeta>
                )}

                {advisorName && (
                  <ProfileMeta icon={UserRound} label={t('advisor')}>
                    <div className="flex items-center gap-3">
                      {advisorMember?.thumbnail && (
                        <Link
                          href={`/member/${advisorMember.id}`}
                          className="shrink-0"
                          aria-label={t('viewProfileAria', {
                            name: advisorName
                          })}
                        >
                          <Avatar
                            src={advisorMember.thumbnail}
                            size={44}
                            alt={`${advisorName} portrait`}
                            variant="soft"
                            className="hover:scale-[1.04]"
                          />
                        </Link>
                      )}
                      <div className="min-w-0">
                        {advisorMember ? (
                          <Link
                            href={`/member/${advisorMember.id}`}
                            className="font-semibold text-ink-900 transition hover:text-rose-600"
                          >
                            {advisorName}
                          </Link>
                        ) : (
                          <span className="font-semibold text-ink-900">
                            {advisorName}
                          </span>
                        )}
                        {advisorTitle && (
                          <span className="block text-xs leading-5 text-ink-500">
                            {advisorTitle}
                          </span>
                        )}
                      </div>
                    </div>
                  </ProfileMeta>
                )}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
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
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
          <main className="space-y-8">
            {mdHtmlContent && (
              <section className="glass-card px-6 py-7 md:px-8">
                <SectionHeading icon={UserRound} title={t('biography')} />
                <article
                  className="prose mt-5 max-w-none text-sm leading-7 text-ink-700/88 prose-headings:text-ink-900 prose-p:my-4 prose-a:text-rose-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-ink-900 md:text-base"
                  dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
                />
              </section>
            )}

            {member.selectedPublications.length > 0 && (
              <section className="glass-card px-6 py-7 md:px-8">
                <SectionHeading
                  icon={BookOpen}
                  title={t('selectedPublications')}
                  count={member.selectedPublications.length}
                />
                <ul className="mt-5 divide-y divide-silk-200/80">
                  {member.selectedPublications.map((pub: MemberPublication) => (
                    <SelectedPublicationCard {...pub} key={pub.id} />
                  ))}
                </ul>
              </section>
            )}
          </main>

          <aside className="space-y-6">
            {(hasEducation || hasExperience) && (
              <section className="glass-card px-6 py-6">
                <SectionHeading icon={GraduationCap} title={t('credentials')} />
                <div className="mt-5 space-y-6">
                  {hasEducation && (
                    <DetailGroup title={t('education')}>
                      <CompactEducationList education={member.education} />
                    </DetailGroup>
                  )}
                  {hasExperience && (
                    <DetailGroup title={t('professionalExperience')}>
                      <CompactExperienceList
                        experience={member.professionalExperience}
                      />
                    </DetailGroup>
                  )}
                </div>
              </section>
            )}

            {member.honor.length > 0 && (
              <section className="glass-card px-6 py-6">
                <SectionHeading
                  icon={Award}
                  title={t('honorsAwards')}
                  count={member.honor.length}
                />
                <ul className="mt-5 space-y-4">
                  {member.honor.map((honor, idx) => (
                    <li key={idx} className="grid grid-cols-[3.5rem_1fr] gap-3">
                      <span className="rounded-full border border-rose-200/80 bg-rose-50/80 px-2 py-1.5 text-center text-xs font-semibold text-rose-600">
                        {honor.year}
                      </span>
                      <p className="text-sm leading-6 text-ink-700/88">
                        {honor.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {hasFocus && (
              <section className="glass-card px-6 py-6">
                <SectionHeading icon={Sparkles} title={t('focus')} />
                {member.aoi.length > 0 && (
                  <DetailGroup title={t('areasOfInterest')} className="mt-5">
                    <ul className="flex flex-wrap gap-2">
                      {member.aoi.map((area, idx) => (
                        <li
                          key={idx}
                          className="rounded-full border border-silk-300/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-ink-700"
                        >
                          {area}
                        </li>
                      ))}
                    </ul>
                  </DetailGroup>
                )}

                {member.courseTaught.length > 0 && (
                  <DetailGroup
                    title={t('coursesTaught')}
                    className={member.aoi.length > 0 ? 'mt-6' : 'mt-5'}
                  >
                    <ul className="space-y-3">
                      {member.courseTaught.map((course, idx) => (
                        <li
                          key={idx}
                          className="border-l border-rose-200/80 pl-3 text-sm leading-6 text-ink-700/88"
                        >
                          {course}
                        </li>
                      ))}
                    </ul>
                  </DetailGroup>
                )}
              </section>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  count
}: {
  icon: LucideIcon;
  title: string;
  count?: number;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-silk-200/80 pb-3">
      <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
        <Icon size={15} />
        {title}
      </h2>
      {typeof count === 'number' && (
        <span className="rounded-full border border-silk-300/80 bg-white/80 px-3 py-1 text-xs font-semibold text-ink-500">
          {count}
        </span>
      )}
    </header>
  );
}

function ProfileMeta({
  icon: Icon,
  label,
  children
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.35rem_1fr] gap-3">
      <Icon size={17} className="mt-1 text-rose-500" />
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-500">
          {label}
        </p>
        <div className="mt-1 leading-6">{children}</div>
      </div>
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
    'inline-flex items-center justify-center gap-2 rounded-full border border-rose-200/80 bg-white/88 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-600 transition hover:border-rose-300 hover:bg-rose-50';

  // External targets (Scholar) and static assets (CV files under /cv) must not
  // be rewritten with a locale prefix, so they bypass the i18n Link.
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
  className,
  children
}: {
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-rose-500">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

async function CompactEducationList({
  education
}: {
  education: MemberEducation[];
}) {
  const t = await getTranslations('members.profile');

  return (
    <ul className="space-y-4">
      {education.map((edu, idx) => (
        <li key={idx} className="border-l border-rose-200/80 pl-4">
          <p className="text-sm font-semibold leading-6 text-ink-900">
            {t('degreeInField', { degree: edu.degree, field: edu.field })}
          </p>
          <p className="text-sm leading-6 text-ink-600">
            {edu.institution}
            {edu.year ? `, ${edu.year}` : ''}
          </p>
        </li>
      ))}
    </ul>
  );
}

async function CompactExperienceList({
  experience
}: {
  experience: MemberProfExp[];
}) {
  const t = await getTranslations('members.profile');

  return (
    <ul className="space-y-4">
      {experience.map((item, idx) => (
        <li key={idx} className="border-l border-silk-300/80 pl-4">
          <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-ink-900">
            <BriefcaseBusiness size={15} className="mt-1 text-rose-500" />
            <span>{item.title}</span>
          </p>
          <p className="mt-1 text-sm leading-6 text-ink-600">
            {item.institution}, {item.start_year}-
            {item.end_year || t('present')}
          </p>
        </li>
      ))}
    </ul>
  );
}
