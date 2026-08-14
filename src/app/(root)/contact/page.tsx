import { Mail, MapPin, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function Contact() {
  const t = await getTranslations('contact');

  const contactDetails = [
    {
      label: t('emailLabel'),
      value: 'admin@sdsc.edu',
      icon: Mail
    },
    {
      label: t('visitLabel'),
      value:
        'Spatial Data Science Center, College of Social Sciences and Public Policy, Florida State University, Tallahassee, FL 32306',
      icon: MapPin
    }
  ];

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 text-gold-100 md:pt-40">
        <header className="text-center">
          <span className="chip-gold">{t('chip')}</span>
          <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-gold-200/80 md:text-base">
            {t('intro')}
          </p>
        </header>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          {contactDetails.map(({ label, value, icon: Icon }) => (
            <article
              key={label}
              className="glass-card flex items-start gap-4 px-6 py-6 text-gold-100"
            >
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-garnet-500/40 bg-[#160b29]/20 text-gold-200">
                <Icon size={22} />
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.26em] text-gold-300">
                  {label}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gold-200/80">
                  {value}
                </p>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-[1.2fr_1fr] text-gold-100">
          <article className="surface-fade px-8 py-10">
            <h2 className="panel-title text-gold-300">{t('engageTitle')}</h2>
            <ul className="mt-6 space-y-4 text-sm text-gold-200/80">
              <li className="custom-li">{t('engageItem1')}</li>
              <li className="custom-li">{t('engageItem2')}</li>
              <li className="custom-li">{t('engageItem3')}</li>
            </ul>
          </article>

          <article className="glass-card flex flex-col gap-4 px-6 py-8 text-gold-100">
            <div className="flex items-center gap-3 text-gold-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-garnet-500/40 bg-[#160b29]/10">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gold-50">
                {t('gradTitle')}
              </h3>
            </div>
            <p className="text-sm leading-6 text-gold-200/80">
              {t('gradDescription')}
            </p>
          </article>
        </section>
      </div>
    </section>
  );
}
