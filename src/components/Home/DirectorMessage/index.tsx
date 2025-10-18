import Image from 'next/image';

const DirectorMessage = () => {
  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 md:flex-row md:items-center md:gap-14 md:px-10">
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
        <span className="text-xs font-semibold uppercase tracking-[0.35em] text-gold-200/70">
          Center Director&apos;s Message
        </span>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-gold-50 md:text-4xl">
          Mapping possibilities with purpose
        </h2>
        <p className="mt-6 text-base text-gold-100/80 md:text-lg">
          At the Spatial Data Science Center, we build teams that blend rigorous
          spatial analytics with creative design to make sense of complex
          places. Every project is an invitation to look deeper, collaborate
          openly, and deliver insights that matter to communities and decision
          makers alike.
        </p>
        <p className="mt-5 text-base text-gold-100/80 md:text-lg">
          I am excited to welcome new colleagues who share our curiosity and our
          drive to illuminate how location shapes opportunity. Together, we will
          continue expanding the boundaries of GIScience and empowering partners
          across the globe.
        </p>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-gold-200/70">
          Stewart Fotheringham · Founding Director
        </p>
      </div>
    </section>
  );
};

export default DirectorMessage;
