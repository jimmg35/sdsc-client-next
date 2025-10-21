import { ArrowDown } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
import SlideShow from './SlideShow';

const Welcome = () => {
  return (
    <div className="relative w-full h-[100dvh] overflow-hidden p-4 md:p-0">
      {/* Slideshow */}
      <SlideShow />

      {/* Gray filter & scroll down hint */}
      <div className="absolute top-0 left-0 w-full h-full bg-teal-900 opacity-30 -z-5 flex items-end justify-center">
        <div className="relative mb-8 flex items-center gap-4 animate-bounce">
          <ArrowDown size={48} className="text-white" />
          <p className="text-white text-6xl">Scroll Down</p>
        </div>
      </div>

      {/* welcome text */}
      <div className="flex flex-col items-center justify-center h-full relative z-10 text-white">
        <div className="flex flex-col gap-4 items-center justify-center">
          <Fade direction="up" duration={500} cascade triggerOnce>
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              Welcome to Spatial Data Science Center!
            </h1>
            {/*<p className="text-lg font-bold md:text-3xl text-center">
              Your journey into GIScience begins here.
            </p> */}

            {/* <Button
              href="/about"
              icon={<Telescope size={24} className="ml-2" />}
              text="Explore SDSC"
              variant="outlined"
            /> */}
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
