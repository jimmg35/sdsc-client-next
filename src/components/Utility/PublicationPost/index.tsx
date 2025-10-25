import { PublicationData } from '@/lib/publications';
import { ArrowUpRight } from 'lucide-react';

const PublicationPost = ({
  author,
  title,
  journal,
  catalog,
  doi
}: PublicationData) => {
  const doiUrl = doi?.trim();
  const doiLabel = doiUrl
    ? doiUrl.replace(/^https?:\/\/(www\.)?(dx\.)?doi\.org\//i, '')
    : '';

  return (
    <div className="group relative">
      {/* <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/60 opacity-0 transition duration-300 group-hover:opacity-100" /> */}
      <article className="glass-card relative h-full overflow-hidden rounded-[28px] border border-black/5 bg-white/85 p-6 shadow-[0_24px_50px_-30px_rgba(5,0,40,0.28)] backdrop-blur-md transition duration-300 group-hover:-translate-y-1 group-hover:border-black/10 group-hover:shadow-[0_28px_70px_-28px_rgba(10,0,60,0.35)]">
        <div className="pointer-events-none absolute inset-x-6 -top-20 h-40 rounded-[32px] bg-white/60 blur-3xl transition duration-500 group-hover:translate-y-8 group-hover:opacity-90" />
        <div className="relative flex h-full flex-col gap-6 text-ink-900">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-ink-700">
              {journal}
            </span>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-ink-500/70">
              {catalog}
            </p>
            <h3 className="text-2xl font-semibold leading-7 text-ink-900">
              {title}
            </h3>
          </div>

          <p className="text-base font-bold leading-6 text-ink-700/90">
            {author}
          </p>

          {doiUrl && (
            <div className="mt-auto flex items-center  gap-3">
              <span className="text-xs uppercase tracking-[0.28em] text-ink-500/90">
                DOI
              </span>
              <a
                href={doiUrl}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink-700 transition duration-300 hover:border-black/20 hover:bg-white"
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
      </article>
    </div>
  );
};

export default PublicationPost;
