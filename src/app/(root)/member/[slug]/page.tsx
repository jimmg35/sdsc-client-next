import Avatar from '@/components/Utility/Avatar';
import PublicationPost from '@/components/Utility/PublicationPost';
import { markdownToHTML } from '@/lib/md';
import {
  MemberPublication,
  getMemberBiograpgyById,
  getMemberById
} from '@/lib/members';
import { ArrowLeft, GraduationCap, Mail } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = Promise<{
  slug: string;
}>;

export default async function ProfilePage(props: { params: Props }) {
  const { slug } = await props.params;
  const member = getMemberById(slug);
  const biography = getMemberBiograpgyById(slug);

  let mdHtmlContent = '';
  if (biography) {
    mdHtmlContent = await markdownToHTML(biography);
  }

  if (!member) {
    notFound();
  }

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 md:pt-40">
        <div className="mb-8">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-garnet-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-garnet-600 transition hover:border-garnet-300 hover:bg-gold-100/80 hover:text-garnet-700"
            href="/member"
          >
            <ArrowLeft size={16} />
            Back to Members
          </Link>
        </div>

        <article className="surface-fade relative overflow-hidden rounded-[32px] px-6 py-10 md:px-12">
          <div className="relative flex flex-col gap-12 md:flex-row">
            <div className="flex flex-col items-center text-center md:max-w-xs md:flex-none md:text-left">
              <div className="halo">
                <Avatar
                  src={member.thumbnail}
                  size={200}
                  alt={`${member.name} portrait`}
                />
              </div>
              <h1 className="mt-6 text-3xl font-semibold text-garnet-800 text-glow md:text-4xl">
                {member.name}
              </h1>
              {member.title && (
                <p className="mt-2 text-sm text-ink-600 md:text-base">
                  {member.title}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {member.email && (
                  <Link
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-garnet-200/70 bg-gold-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-garnet-600 transition hover:bg-gold-200/70 hover:text-garnet-700"
                  >
                    <Mail size={16} />
                    Email
                  </Link>
                )}
                {member.googleScholar && (
                  <Link
                    href={member.googleScholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-garnet-200/70 bg-gold-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-garnet-600 transition hover:bg-gold-200/70 hover:text-garnet-700"
                  >
                    <GraduationCap size={16} />
                    Scholar
                  </Link>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-10">
              <section className="glass-card px-6 py-8 md:px-8">
                <header className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="panel-title text-garnet-500">Biography</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-garnet-100 to-garnet-300/60" />
                </header>
                <article
                  className="prose max-w-none text-ink-700 prose-headings:font-semibold prose-headings:text-garnet-700 prose-a:text-garnet-600 prose-strong:text-ink-900 prose-blockquote:border-garnet-200 prose-blockquote:text-garnet-700"
                  dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
                />
              </section>

              <div className="grid gap-8 md:grid-cols-2">
                <section className="glass-card px-6 py-6">
                  <header className="panel-title text-garnet-500">
                    Department
                  </header>
                  <p className="mt-3 text-sm text-ink-700 md:text-base">
                    {member.department}
                  </p>
                </section>

                {member.education && member.education.length > 0 && (
                  <section className="glass-card px-6 py-6">
                    <header className="panel-title text-garnet-500">
                      Education
                    </header>
                    <ul className="mt-4 space-y-3">
                      {member.education.map((edu, idx) => (
                        <li key={idx} className="custom-li">
                          <p className="text-sm font-semibold text-ink-700">
                            {edu.degree} in {edu.field}
                          </p>
                          <p className="text-xs text-ink-500">
                            {edu.institution}
                            {edu.year ? `, ${edu.year}` : ''}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {member.aoi && member.aoi.length > 0 && (
                <section className="glass-card px-6 py-6">
                  <header className="panel-title text-garnet-500">
                    Areas of Interest
                  </header>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {member.aoi.map((area, idx) => (
                      <li
                        key={idx}
                        className="rounded-full border border-garnet-200/70 bg-gold-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-garnet-600"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {member.courseTaught && member.courseTaught.length > 0 && (
                <section className="glass-card px-6 py-6">
                  <header className="panel-title text-garnet-500">
                    Courses Taught
                  </header>
                  <ul className="mt-4 space-y-3">
                    {member.courseTaught.map((course, idx) => (
                      <li key={idx} className="custom-li">
                        {course}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {member.honor && member.honor.length > 0 && (
                <section className="glass-card px-6 py-6">
                  <header className="panel-title text-garnet-500">
                    Honors & Awards
                  </header>
                  <ul className="mt-4 space-y-3">
                    {member.honor.map((honor, idx) => (
                      <li key={idx} className="custom-li">
                        <p className="text-sm font-semibold text-ink-700">
                          {honor.title}
                        </p>
                        <p className="text-xs text-ink-500">{honor.year}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {member.selectedPublications &&
                member.selectedPublications.length > 0 && (
                  <section className="glass-card px-6 py-6">
                    <header className="panel-title text-garnet-500">
                      Selected Publications
                    </header>
                    <ul className="mt-6 flex flex-col gap-4">
                      {member.selectedPublications.map(
                        (pub: MemberPublication, idx: number) => (
                          <PublicationPost {...pub} key={idx} />
                        )
                      )}
                    </ul>
                  </section>
                )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
