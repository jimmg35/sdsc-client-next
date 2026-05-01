import Avatar from '@/components/Utility/Avatar';
import { MemberData } from '@/lib/members';
import {
  ArrowUpRight,
  GraduationCap,
  Mail,
  UsersRound
} from 'lucide-react';
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
  detail: string;
};

type MembersDirectoryProps = {
  director: MemberData | null;
  sections: MemberDirectorySection[];
  overview: OverviewMetric[];
};

export default function MembersDirectory({
  director,
  sections,
  overview
}: MembersDirectoryProps) {
  return (
    <>
      <section className="surface-fade mb-16 overflow-hidden px-6 py-8 md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_84%_-12%,_rgba(168,110,161,0.24),_transparent_55%),radial-gradient(110%_110%_at_12%_-16%,_rgba(194,156,106,0.22),_transparent_52%)]" />

        <div className="relative">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,1fr)] lg:items-end">
            <div>
              <p className="panel-title text-gold-300">Browse The Collective</p>
              <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
                Navigate SDSC by role, then dive into individual profiles
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-gold-200/78 md:text-base">
                The directory is organized around how people contribute to the
                center: leadership, core faculty, affiliated collaborators, and
                graduate researchers. Use the section links below to jump
                directly into the layer you want.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {director && (
                  <AnchorLink href="#director" label="Center Director" />
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
                  className="rounded-[24px] border border-rose-100/75 bg-white/78 px-5 py-5 text-ink-900 shadow-[0_20px_44px_-34px_rgba(61,47,39,0.35)]"
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
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
                <UsersRound size={14} />
                {section.members.length}{' '}
                {section.members.length === 1 ? 'Member' : 'Members'}
              </div>
              <div className="inline-flex items-center rounded-full border border-gold-400/35 bg-gold-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-100">
                Sorted A-Z
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

function DirectorSpotlight({ member }: { member: MemberData }) {
  return (
    <section
      id="director"
      className="surface-fade mb-16 scroll-mt-36 px-6 py-10 md:px-10 md:scroll-mt-44"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="panel-title text-gold-300">Center Director</p>
          <h2 className="mt-4 text-3xl font-semibold text-gold-50 text-glow">
            Leadership at the center of SDSC
          </h2>
        </div>
        <div className="inline-flex items-center self-start whitespace-nowrap rounded-full border border-rose-200/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
          Director Spotlight
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
            {member.centerRole || 'Center Director'}
          </span>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.26em] text-gold-300/75">
            Spatial Data Science Center
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
            <ActionLink href={`/member/${member.id}`} label="View Profile" />
            {member.googleScholar && (
              <ActionLink
                href={member.googleScholar}
                label="Scholar"
                external
              />
            )}
            {member.email && (
              <ActionLink href={`mailto:${member.email}`} label="Email" />
            )}
          </div>

          {member.honor.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold-300/70">
                Select Recognition
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {member.honor.slice(0, 4).map((honor) => (
                  <div
                    key={`${honor.title}-${honor.year}`}
                    className="rounded-[20px] border border-rose-100/70 bg-white/70 px-4 py-4 text-sm leading-6 text-ink-700"
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

function MemberCard({ member }: { member: MemberData }) {
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
            {member.centerRole || 'SDSC Member'}
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
            <span className="font-semibold text-gold-300/82">Advisor:</span>{' '}
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
  external = false
}: {
  href: string;
  label: string;
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
      {label === 'Scholar' ? (
        <GraduationCap size={15} />
      ) : label === 'Email' ? (
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
      className="inline-flex items-center rounded-full border border-rose-200/70 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
    >
      {label}
    </Link>
  );
}
