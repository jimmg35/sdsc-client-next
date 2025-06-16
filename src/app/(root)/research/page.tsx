import Banner from '@/components/Utility/Banner';
import { Globe, LineChart, MapPin, Microscope } from 'lucide-react';

export default function Research() {
  return (
    <section className="relative min-h-dvh">
      <Banner
        title="Research"
        imageUrl="/img/banners/research-banner.jpg"
        icon={<Microscope size={52} className="inline-block mr-2" />}
      />
      <div className="mx-auto max-w-7xl py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Research Focus
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Geospatial Modeling */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <Globe className="text-teal-500 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                Geospatial Modeling
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We explore how spatial relationships and geographic features
              influence real-world phenomena using computational and
              mathematical modeling approaches. Applications include urban
              dynamics, environmental modeling, and spatial simulation.
            </p>
          </div>

          {/* Spatial Statistics */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <LineChart className="text-teal-500 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                Spatial Statistics
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We utilize statistical methods that account for spatial dependency
              and heterogeneity. Topics include spatial autocorrelation, spatial
              regression, clustering, and spatial hypothesis testing.
            </p>
          </div>

          {/* Geographically Weighted Regression */}
          <div className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center mb-4">
              <MapPin className="text-teal-500 w-6 h-6 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">
                Geographically Weighted Regression
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              GWR is a core method in our research. We investigate both its
              theoretical development and real-world application, extending it
              with AI techniques such as deep learning and reinforcement
              learning to enhance local model interpretability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
