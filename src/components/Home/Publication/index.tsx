import { ScrollText } from "lucide-react";
import Heading from "../Heading";

const Publication = () => {
  return (
    <div className=" bg-white relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <Heading
          title="Publication"
          subtitle="Access our latest journal!"
          icon={<ScrollText size={32} className="inline-block mr-2" />}
        />
      </div>
    </div>
  );
};

export default Publication;
