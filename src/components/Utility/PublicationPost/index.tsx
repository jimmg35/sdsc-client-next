import { PublicationData } from '@/lib/publications';

const PublicationPost = ({
  author,
  title,
  journal,
  catalog,
  doi
}: PublicationData) => {
  return (
    <li className="surface-fade group relative overflow-hidden rounded-[22px] border border-garnet-600/30 bg-[#120922]/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-garnet-400/45">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-garnet-600/35 via-transparent to-gold-500/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative space-y-3 text-gold-100">
        <p className="panel-title">{catalog}</p>
        <p className="text-base font-semibold leading-6 text-gold-50 text-glow">{title}</p>
        <p className="text-sm text-gold-300/80">{author}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gold-300/80">
          <span className="rounded-full border border-gold-400/30 bg-garnet-700/50 px-3 py-1 uppercase tracking-[0.18em]">
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
