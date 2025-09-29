import { Clock, Mail, MapPin, PhoneCall, Users } from 'lucide-react';

const contactDetails = [
  {
    label: 'Call SDSC',
    value: '+1 (850) 123-4567',
    icon: PhoneCall
  },
  {
    label: 'Email',
    value: 'contact@sdsc.fsu.edu',
    icon: Mail
  },
  {
    label: 'Visit',
    value:
      'Department of Geography, Florida State University, Tallahassee, FL 32306',
    icon: MapPin
  },
  {
    label: 'Office Hours',
    value: 'Monday - Friday | 9:00 AM - 5:00 PM ET',
    icon: Clock
  }
];

export default function Contact() {
  return (
    <section className="page-shell">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 text-gold-100 md:pt-40">
        <header className="text-center">
          <span className="chip-gold">Connect With Us</span>
          <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            Let&apos;s build spatial solutions together
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-gold-200/80 md:text-base">
            Whether you are a researcher, student, or community partner, SDSC
            collaborates on projects that transform spatial data into tangible
            outcomes. Reach out - we&apos;re ready to help.
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
            <h2 className="panel-title text-gold-300">Engage with SDSC</h2>
            <ul className="mt-6 space-y-4 text-sm text-gold-200/80">
              <li className="custom-li">
                Schedule a consultation for research collaborations or sponsored
                projects.
              </li>
              <li className="custom-li">
                Host a workshop or guest lecture focused on spatial analytics
                and MGWR.
              </li>
              <li className="custom-li">
                Partner with our graduate studios for immersive design sprints.
              </li>
            </ul>
          </article>

          <article className="glass-card flex flex-col gap-4 px-6 py-8 text-gold-100">
            <div className="flex items-center gap-3 text-gold-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-garnet-500/40 bg-[#160b29]/10">
                <Users size={22} />
              </div>
              <h3 className="text-lg font-semibold text-gold-50">
                Student Opportunities
              </h3>
            </div>
            <p className="text-sm leading-6 text-gold-200/80">
              SDSC offers assistantships, studio projects, and mentoring for
              students passionate about spatial data science. Email us to learn
              about current openings and how to get involved.
            </p>
          </article>
        </section>
      </div>
    </section>
  );
}
