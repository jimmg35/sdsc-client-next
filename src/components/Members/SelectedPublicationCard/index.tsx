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
    /* A ruled entry rather than a card: the profile's publication list reads
       as one column of references. */
    <li className="group border-t border-accent-600/25 py-6">
      <article className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
        <div className="min-w-0">
          {(journal || catalog) && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
              {journal && <span className="text-primary-600">{journal}</span>}
              {catalog && (
                <span className="font-medium tracking-[0.18em] text-ink-500">
                  {catalog}
                </span>
              )}
            </div>
          )}

          <h3 className="mt-3 text-base font-medium leading-7 tracking-[-0.01em] text-ink-900 md:text-lg">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-700">{author}</p>
        </div>

        {doiUrl && (
          <a
            href={doiUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary-600 transition-colors hover:text-primary-700 md:mt-1"
          >
            DOI
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        )}
      </article>
    </li>
  );
};

export default SelectedPublicationCard;
