import Banner from '@/components/Utility/Banner';
import { Globe, Info, LineChart, MapPin } from 'lucide-react';

export default function About() {
  return (
    <section className="relative min-h-dvh">
      <Banner
        title="About"
        imageUrl="/img/banners/about-banner.jpg"
        icon={<Info size={52} className="inline-block mr-2" />}
      />
      <div className="mx-auto max-w-7xl py-16 px-6 space-y-16">
        {/* Introduction */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Who We Are</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            The Spatial Data Science Center (SDSC) at Florida State University
            is dedicated to cutting-edge research in geographic information
            science, with a strong emphasis on geospatial modeling, spatial
            statistics, and machine learning. We aim to bridge computational
            methods with real-world spatial challenges.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 mr-3 text-teal-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Spatial Thinking
              </h3>
            </div>
            <p className="text-gray-600">
              We promote spatial thinking as a critical lens to analyze global
              and local issues, from climate change to social inequality.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <LineChart className="w-6 h-6 mr-3 text-teal-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Data-Driven Insight
              </h3>
            </div>
            <p className="text-gray-600">
              Our research harnesses advanced spatial statistics and machine
              learning to uncover patterns and generate actionable insights.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 mr-3 text-teal-500" />
              <h3 className="text-xl font-semibold text-gray-800">
                Place Matters
              </h3>
            </div>
            <p className="text-gray-600">
              We emphasize the importance of place in understanding social,
              environmental, and economic dynamics across scales.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
