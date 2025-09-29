import { PublicationData } from '@/lib/publications';

const PublicationPost = ({
  author,
  title,
  journal,
  catalog,
  doi
}: PublicationData) => {
  return (
    <li className="surface-fade group relative overflow-hidden rounded-[22px] border border-garnet-200/50 bg-white/85 p-5 transition duration-300 hover:-translate-y-1 hover:border-garnet-300/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-200/35 via-transparent to-garnet-200/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative space-y-3">
        <p className="panel-title">{catalog}</p>
        <p className="text-base font-semibold leading-6 text-garnet-700 text-glow">
          {title}
        </p>
        <p className="text-sm text-ink-500">{author}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-garnet-500/80">
          <span className="rounded-full border border-garnet-200/70 bg-gold-100/70 px-3 py-1 uppercase tracking-[0.18em]">
            {journal}
          </span>
          <span className="glow-link text-[0.7rem] uppercase tracking-[0.25em]">
            DOI {doi}
          </span>
        </div>
      </div>
    </li>
  );
};

export default PublicationPost;
