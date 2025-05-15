import { Atom, FolderCode, Microscope } from "lucide-react";

const Circle = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-64 rounded-full border-2 border-teal-400 transition-all duration-300">
      <div className="absolute inset-0 rounded-full border-4 border-teal-400 opacity-0 hover:opacity-100 transition-all duration-300"></div>
      {children}
      <p className="text-teal-600 text-lg">{text}</p>
    </div>
  );
};

const WhoWeAre = () => {
  return (
    <div className="relative w-full h-fit overflow-hidden px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl md:text-7xl font-bold">Who We Are</h1>
      <p className="mt-4 text-xl mx-4 md:mx-84 text-center">
        The SDSC serves as a platform where anyone with spatial analysis needs
        can turn to us for support. We also provide a range of open-source
        spatial software for use.
      </p>
      <div className="flex gap-8 py-8 justify-center flex-wrap">
        <Circle text="Spatial Data Science">
          <Atom size={48} className="text-teal-400" />
        </Circle>
        <Circle text="MGWR Software">
          <FolderCode size={48} className="text-teal-400" />
        </Circle>
        <Circle text="Interdisciplinary Research">
          <Microscope size={48} className="text-teal-400" />
        </Circle>
      </div>
      <p className="mt-4 text-xl mx-4 md:mx-84 text-center font-bold">
        Empowering spatial understanding through cutting-edge GIScience
        research.
      </p>
    </div>
  );
};

export default WhoWeAre;
