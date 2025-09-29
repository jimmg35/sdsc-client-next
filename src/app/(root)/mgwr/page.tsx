import AppCard from '@/components/Utility/AppCard';
import { BookOpen, Compass, Layers, LineChart } from 'lucide-react';
import Link from 'next/link';

const downloads = [
  {
    title: 'MGWR GUI (Windows)',
    description:
      'Installer package with the latest stable build and examples for Windows 10/11 environments.',
    imageUrl: '/img/software/mgwr.png',
    href: '#',
    meta: 'Windows | 64-bit'
  },
  {
    title: 'MGWR GUI (macOS)',
    description:
      'Universal binary for Apple Silicon and Intel Macs with notarized installer and sample projects.',
    imageUrl: '/img/software/mgwr.png',
    href: '#',
    meta: 'macOS | Universal'
  }
];

const highlights = [
  'Multi-scale geographically weighted regression with intuitive controls',
  'Interactive bandwidth exploration and model comparison dashboards',
  'Bundled sample datasets to help you get started in minutes'
];

export default function MGWR() {
  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-40">
        <header className="text-center text-ink-900">
          <span className="chip-gold">MGWR Tools</span>
          <h1 className="mt-6 text-4xl font-semibold text-garnet-800 text-glow md:text-5xl">
            Spatial regression made accessible
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-ink-600 md:text-base">
            Download the latest graphical user interface for Multi-Scale
            Geographically Weighted Regression and accelerate exploratory
            spatial analysis across platforms.
          </p>
        </header>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {downloads.map((item) => (
            <AppCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-[2fr_1fr]">
          <section className="glass-card px-8 py-8">
            <header className="panel-title text-garnet-500">
              <Compass size={18} />
              Why analysts choose MGWR
            </header>
            <ul className="mt-6 space-y-3">
              {highlights.map((feature) => (
                <li key={feature} className="custom-li">
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card flex flex-col gap-6 px-8 py-8">
            <div className="flex items-start gap-3">
              <Layers className="text-garnet-600" size={20} />
              <div>
                <p className="text-sm font-semibold text-garnet-700">
                  Inputs &amp; Outputs
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Works seamlessly with shapefiles and GeoPackage datasets.
                  Export model diagnostics and surfaces for integration in GIS
                  workflows.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <LineChart className="text-garnet-600" size={20} />
              <div>
                <p className="text-sm font-semibold text-garnet-700">
                  Model transparency
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Visualize bandwidth optimizations, coefficient sensitivity,
                  and local R2 improvements in an interactive dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="text-garnet-600" size={20} />
              <div>
                <p className="text-sm font-semibold text-garnet-700">
                  Documentation
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Explore step-by-step tutorials, formula references, and sample
                  workflows to shorten the learning curve.
                </p>
                <Link
                  href="#"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-garnet-600 hover:text-garnet-700"
                >
                  View Guides
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
