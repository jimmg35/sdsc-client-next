import Image from 'next/image';

const DirectorMessage = () => {
  return (
    <section className="surface-fade relative overflow-hidden rounded-none px-6 py-16 md:px-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-10%,_rgba(124,74,158,0.32),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_20%_-20%,_rgba(189,156,99,0.32),_transparent_60%)]" />

      <div className="relative items-center gap-8 text-center text-gold-100 mx-auto flex w-full max-w-6xl flex-col px-4 py-20 md:flex-row md:items-center md:gap-14 md:px-10">
        <div className="relative mx-auto h-[18rem] w-[18rem] max-w-xs overflow-hidden rounded-[3rem] border border-gold-50/30 bg-garnet-900/60 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.75)] backdrop-blur md:mx-0">
          <Image
            src="/img/avatar/stewart-fotheringham.jpg"
            alt="Professor Stewart Fotheringham, Center Director"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 18rem, 18rem"
            priority
          />
        </div>
        <div className="text-gold-50 md:w-2/3">
          <span className="mt-4 text-3xl font-semibold leading-tight text-gold-50 md:text-4xl">
            Message from the Director
          </span>
          <p className="mt-6 text-base text-gold-100/80 md:text-lg text-justify">
            Welcome to the Spatial Data Science Center (SDSC) where solutions to
            many of the World&apos;s most pressing problems are being forged
            through the development of sophisticated statistical methods and the
            application of new approaches such as GeoAI and machine learning.
            Our expertise extends to all types of domain areas including health,
            transportation, voting, crime, housing, retailing, and the
            environment.{' '}
            <strong className="font-semibold">
              Our work is built on the fundamental principle that understanding
              where these challenges occur is the key to understanding why they
              occur and how to solve them.
            </strong>
          </p>
          <p className="mt-5 text-base text-gold-100/80 md:text-lg text-justify">
            The SDSC aims to be a focal point for all the great work that is
            taking place in spatial data science across many departments at FSU.
            Whether you&apos;re a faculty member wanting to pursue joint
            research or a funding application, or are interested in becoming an
            affiliate, or a representative of a government department or private
            firm needing consulting assistance, or a student interested in being
            involved in SDSC activities, contact us at
            stewart.fotheringham@fsu.edu.
          </p>
          <div className="mt-6 flex items-center flex-row-reverse gap-4">
            <Image
              src="/img/stewart-signature.png"
              alt="Signature of Stewart Fotheringham"
              width={220}
              height={72}
              className="h-auto w-auto max-w-[14rem]"
              priority
            />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-200/70">
              Founding Director
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;
