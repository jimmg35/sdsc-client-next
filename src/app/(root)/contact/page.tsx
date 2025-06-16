import Banner from '@/components/Utility/Banner';
import PublicationPost from '@/components/Utility/PublicationPost';
import Search from '@/components/Utility/Search';
import { PublicationData, getAllPublications } from '@/lib/publications';
import { Clock, Mail, MapPin, PhoneCall, ScrollText } from 'lucide-react';

export default function Contact() {
  // const publications: PublicationData[] = getAllPublications();

  return (
    <section className="relative min-h-dvh">
      <Banner
        title="Contact"
        imageUrl="/img/banners/publications-banner.jpg"
        icon={<PhoneCall size={52} className="inline-block mr-2" />}
      />
      <div className="mx-auto h-[calc(100dvh-300px)] max-w-7xl py-10 px-6 flex flex-wrap items-center justify-center gap-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Contact Information
        </h2>
        <ul className="space-y-4 text-gray-700">
          <li className="flex items-center">
            <PhoneCall className="w-5 h-5 mr-3 text-teal-500" />
            <span>+1 (850) 123-4567</span>
          </li>
          <li className="flex items-center">
            <Mail className="w-5 h-5 mr-3 text-teal-500" />
            <span>contact@sdsc.fsu.edu</span>
          </li>
          <li className="flex items-center">
            <MapPin className="w-5 h-5 mr-3 text-teal-500" />
            <span>
              Department of Geography, Florida State University, Tallahassee, FL
              32306
            </span>
          </li>
          <li className="flex items-center">
            <Clock className="w-5 h-5 mr-3 text-teal-500" />
            <span>Office Hours: Mon - Fri, 9:00 AM - 5:00 PM</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
