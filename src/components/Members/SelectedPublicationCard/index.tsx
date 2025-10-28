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
  const doiLabel = doiUrl
    ? doiUrl.replace(/^https?:\/\/(www\.)?(dx\.)?doi\.org\//i, '')
    : '';

  return (
    <li className="glass-card group rounded-2xl border border-gold-400/30  p-5 transition duration-300 ">
      <div className="flex flex-col gap-4 text-gold-100">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-gold-200">
            {journal}
          </span>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-300/70">
            {catalog}
          </p>
          <h4 className="text-xl font-semibold leading-7 text-gold-50">
            {title}
          </h4>
        </div>

        <p className="text-sm font-medium text-gold-100/80">{author}</p>

        {doiUrl && (
          <div className="mt-auto flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold-300/80">
            <span>DOI</span>
            <a
              href={doiUrl}
              target="_blank"
              rel="noreferrer"
              className="group/link inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-gold-100 transition duration-300 hover:border-gold-300/60 hover:bg-gold-500/20"
            >
              {doiLabel}
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
              />
            </a>
          </div>
        )}
      </div>
    </li>
  );
};

export default SelectedPublicationCard;
