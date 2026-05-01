import { MemberPublication } from '@/lib/members';
import { ArrowUpRight } from 'lucide-react';

const SelectedPublicationCard = ({
  author,
  title,
  journal,
  catalog,
  doi
}: MemberPublication) => {
  const doiUrl = doi?.trim();

  return (
    <li className="group py-5 first:pt-0 last:pb-0">
      <article className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div className="min-w-0 space-y-3 text-ink-800">
          <div className="flex flex-wrap items-center gap-2">
            {journal && (
              <span className="rounded-full border border-rose-200/80 bg-rose-50/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-600">
                {journal}
              </span>
            )}
            {catalog && (
              <span className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink-500">
                {catalog}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold leading-7 text-ink-900">
            {title}
          </h3>
          <p className="text-sm leading-6 text-ink-600">{author}</p>
        </div>

        {doiUrl && (
          <a
            href={doiUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
          >
            DOI
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        )}
      </article>
    </li>
  );
};

export default SelectedPublicationCard;
