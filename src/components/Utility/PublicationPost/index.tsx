import Avatar from '@/components/Utility/Avatar';
import { PublicationData } from '@/lib/publications';
import { ArrowUpRight, Users } from 'lucide-react';
import Link from 'next/link';

export type PublicationCardMember = {
  id: string;
  name: string;
  thumbnail: string;
};

type PublicationPostProps = PublicationData & {
  centerMembers: PublicationCardMember[];
};

const PublicationPost = ({
  title,
  journal,
  catalog,
  doi,
  year,
  centerMembers
}: PublicationPostProps) => {
  const doiUrl = doi?.trim();
  const doiLabel = doiUrl
    ? doiUrl.replace(/^https?:\/\/(www\.)?(dx\.)?doi\.org\//i, '')
    : '';
  const publicationYear = year ? String(year) : 'Undated';

  return (
    <article className="group calcite-box relative overflow-hidden px-6 py-6 md:px-7 md:py-7">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,_rgba(214,167,208,0.22),_transparent_58%)] opacity-80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center rounded-full border border-rose-200/60 bg-rose-50/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-rose-600">
              {publicationYear}
            </span>
            {journal && (
              <span className="inline-flex items-center rounded-full border border-silk-300/70 bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ink-700">
                {journal}
              </span>
            )}
          </div>

          {doiUrl && (
            <a
              href={doiUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white/85 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-ink-700 transition duration-300 hover:border-black/20 hover:bg-white"
            >
              DOI
              <span className="max-w-[14rem] truncate">{doiLabel}</span>
              <ArrowUpRight size={14} />
            </a>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="max-w-4xl text-2xl font-semibold leading-tight text-ink-900 md:text-[2rem]">
            {title}
          </h3>
          {catalog && (
            <p className="max-w-3xl text-sm leading-6 text-ink-600 md:text-[0.96rem]">
              {catalog}
            </p>
          )}
        </div>

        <div className="rounded-[26px] border border-black/6 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(253,247,241,0.82))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-rose-500">
                <Users size={14} />
                SDSC Contributors
              </p>
              <p className="text-sm text-ink-500">
                Only center members participating in this publication are shown.
              </p>
            </div>

            {centerMembers.length > 0 && (
              <span className="inline-flex self-start rounded-full border border-silk-200/80 bg-white/85 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ink-500">
                {centerMembers.length}{' '}
                {centerMembers.length === 1 ? 'Member' : 'Members'}
              </span>
            )}
          </div>

          {centerMembers.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {centerMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/member/${member.id}`}
                  className="group/member inline-flex items-center gap-3 rounded-full border border-silk-200/80 bg-white/90 px-3 py-2 text-sm font-medium text-ink-700 transition duration-200 hover:border-rose-200/70 hover:bg-rose-50/70 hover:text-ink-900"
                >
                  <Avatar
                    src={member.thumbnail}
                    size={40}
                    alt={`${member.name} portrait`}
                    variant="soft"
                    className="group-hover/member:scale-[1.04]"
                  />
                  <span>{member.name}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-silk-300/90 bg-white/75 px-4 py-3 text-sm text-ink-500">
              SDSC contributor metadata is not available for this publication
              yet.
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PublicationPost;
