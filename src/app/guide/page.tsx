import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SDSC Guide',
  description: 'Our official website has moved to the link below.'
};

export default function GuidePage() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center px-6 py-16">
      <section className="glass-card relative w-full max-w-5xl overflow-hidden p-10 md:p-14">
        <div className="absolute inset-0 -z-10 opacity-80">
          <div className="absolute -left-24 -top-16 h-52 w-52 rounded-full bg-rose-200/70 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-60 w-60 rounded-full bg-amber-200/70 blur-3xl" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <div className="chip-gold mb-6">Official Notice</div>
            <h1 className="text-glow text-3xl font-semibold text-ink-900 md:text-4xl">
              Our Official Website Has Moved
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-700 md:text-lg">
              Please use the link below to access the new official SDSC website.
              Update your bookmarks to stay connected with the latest
              information and services.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                className="calcite-focus inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-600"
                href="https://sdsc.fsu.edu/"
              >
                Go to New SDSC Site
              </Link>
            </div>
          </div>

          <div className="surface-fade p-6 md:p-8">
            <div className="panel-title mb-4">What Changed</div>
            <div className="space-y-4 text-sm text-ink-700">
              <div className="rounded-2xl border border-rose-100/80 bg-white/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                  New Destination
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  The official SDSC website is now hosted at the link shown on
                  this page.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100/80 bg-white/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                  Stay Updated
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  Please update any bookmarks or saved links to avoid missing
                  announcements.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-100/80 bg-white/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">
                  Need Help
                </div>
                <p className="mt-2 text-sm leading-relaxed">
                  Visit the official site for contact details and support
                  options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
