import AppCard from '@/components/Utility/AppCard';

export default function MGWR() {
  return (
    <section className="relative min-h-dvh">
      <div className="mx-auto max-w-7xl pb-10 pt-30 px-6 flex flex-wrap justify-center items-center gap-4">
        <AppCard
          title="MGWR GUI (Windows)"
          description="Multi-Scale Geographically Weighted Regression"
          imageUrl="/img/software/mgwr.png"
        />
        <AppCard
          title="MGWR GUI (Mac)"
          description="Multi-Scale Geographically Weighted Regression"
          imageUrl="/img/software/mgwr.png"
        />
      </div>
    </section>
  );
}
