import Link from "next/link";
import { Telescope } from "lucide-react";

const Welcome = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden p-4 md:p-0">
      {/* bg video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10 backdrop-blur-sm"
      >
        <source src="/vid/welcome.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* gray filter for vid */}
      <div className="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-50 -z-5"></div>

      {/* welcome text */}
      <div className="flex flex-col items-center justify-center h-full relative z-10 text-white">
        <div className="bg-teal-500/90 p-4 rounded-lg flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-bold">
            Welcome to Spatial Data Science Center!
          </h1>
          <div className="flex">
            <p className="text-xl md:text-3xl">
              Your journey into GIScience begins here.
            </p>

            <Link
              href={"/about"}
              className={`hover:bg-white hover:text-teal-400 transition ml-4 pt-2 pb-2 flex items-center gap-1 border-2 border-white pr-2 rounded-md`}
            >
              <Telescope size={24} className="ml-2" />
              Explore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
