import Link from "next/link";
import { Telescope, ArrowDown } from "lucide-react";
import SlideShow from "./SlideShow";

const Welcome = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden p-4 md:p-0">
      {/* Slideshow */}
      <SlideShow />

      {/* Gray filter & scroll down hint */}
      <div className="absolute top-0 left-0 w-full h-full bg-teal-900 opacity-50 -z-5 flex items-end justify-center">
        <div className="relative mb-8 flex items-center gap-4 animate-bounce">
          <ArrowDown size={48} className="text-white" />
          <p className="text-white text-3xl">Scroll Down</p>
        </div>
      </div>

      {/* welcome text */}
      <div className="flex flex-col items-center justify-center h-full relative z-10 text-white">
        <div className="bg-teal-500/80 p-4 rounded-lg flex flex-col gap-4">
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
