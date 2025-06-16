'use client';

import Banner from '@/components/Utility/Banner';
import { CalendarDays } from 'lucide-react';

export default function Events() {
  return (
    <section className="relative min-h-dvh bg-gray-50">
      <Banner
        title="Events"
        imageUrl="/img/banners/events-banner.jpg"
        icon={<CalendarDays size={52} className="inline-block mr-2" />}
      />
      <div className="mx-auto max-w-7xl py-16 px-6"></div>
    </section>
  );
}
