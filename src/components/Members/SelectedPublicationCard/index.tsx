import { ArrowUpRight } from 'lucide-react';

type SelectedPublicationCardProps = {
  author: string;
  title: string;
  journal: string;
  catalog: string;
  doi: string;
};

const SelectedPublicationCard = ({
  author,
  title,
  journal,
  catalog,
  doi
}: SelectedPublicationCardProps) => {
  const doiUrl = doi?.trim();

  return (
    <li className="rounded-3xl border border-garnet-700/40 bg-[#160b29]/30 p-5 text-gold-100 shadow-[0_24px_50px_-28px_rgba(16,11,32,0.6)]">
      <div className="flex flex-col gap-4">
        <span className="inline-flex items-center gap-2 self-start rounded-full border border-gold-300/30 bg-garnet-700/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-200/90">
          {journal}
        </span>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.26em] text-gold-200/70">
            {catalog}
          </p>
          <h3 className="text-lg font-semibold leading-6 text-gold-50 text-glow">
            {title}
          </h3>
        </div>
        <p className="text-sm text-gold-200/85">{author}</p>

        {doiUrl && (
          <a
            href={doiUrl}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 self-start text-xs font-semibold uppercase tracking-[0.24em] text-gold-300 transition-colors duration-200 hover:text-gold-100"
          >
            View Publication
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        )}
      </div>
    </li>
  );
};

export default SelectedPublicationCard;
