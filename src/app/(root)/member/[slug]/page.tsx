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
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 text-gold-100 md:pt-40">
        <div className="mb-8">
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-[#160b29]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-200 transition hover:border-gold-400 hover:text-gold-50"
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
              <h1 className="mt-6 text-3xl font-semibold text-gold-50 text-glow md:text-4xl">
                {member.name}
              </h1>
              {member.title && (
                <p className="mt-2 text-sm text-gold-200/80 md:text-base">
                  {member.title}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {member.email && (
                  <Link
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-gold-100 transition hover:bg-gold-500/35"
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
                    className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-gold-100 transition hover:bg-gold-500/35"
                  >
                    <GraduationCap size={16} />
                    Scholar
                  </Link>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-10 text-gold-100">
              <section className="glass-card px-6 py-8 md:px-8">
                <header className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="panel-title text-gold-300">Biography</h3>
                  <div className="h-px flex-1 bg-gradient-to-r from-garnet-600/20 to-gold-400/40" />
                </header>
                <article
                  className="prose max-w-none text-gold-200/80 prose-headings:font-semibold prose-headings:text-gold-100 prose-a:text-gold-300 prose-a:no-underline hover:prose-a:underline prose-strong:text-gold-50 prose-blockquote:border-gold-400/30 prose-blockquote:text-gold-50"
                  dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
                />
              </section>

              <div className="grid gap-8 md:grid-cols-2">
                <section className="glass-card px-6 py-6">
                  <header className="panel-title text-gold-300">
                    Department
                  </header>
                  <p className="mt-3 text-sm text-gold-200/80 md:text-base">
                    {member.department}
                  </p>
                </section>

                {member.education && member.education.length > 0 && (
                  <section className="glass-card px-6 py-6">
                    <header className="panel-title text-gold-300">
                      Education
                    </header>
                    <ul className="mt-4 space-y-3">
                      {member.education.map((edu, idx) => (
                        <li key={idx} className="custom-li">
                          <p className="text-sm font-semibold text-gold-100">
                            {edu.degree} in {edu.field}
                          </p>
                          <p className="text-xs text-gold-300/70">
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
                  <header className="panel-title text-gold-300">
                    Areas of Interest
                  </header>
                  <ul className="mt-4 flex flex-wrap gap-3">
                    {member.aoi.map((area, idx) => (
                      <li
                        key={idx}
                        className="rounded-full border border-gold-400/40 bg-garnet-700/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-gold-100"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {member.courseTaught && member.courseTaught.length > 0 && (
                <section className="glass-card px-6 py-6">
                  <header className="panel-title text-gold-300">
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
                  <header className="panel-title text-gold-300">
                    Honors & Awards
                  </header>
                  <ul className="mt-4 space-y-3">
                    {member.honor.map((honor, idx) => (
                      <li key={idx} className="custom-li">
                        <p className="text-sm font-semibold text-gold-100">
                          {honor.title}
                        </p>
                        <p className="text-xs text-gold-300/70">{honor.year}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {member.selectedPublications &&
                member.selectedPublications.length > 0 && (
                  <section className="glass-card px-6 py-6">
                    <header className="panel-title text-gold-300">
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
