import { ScrollText } from "lucide-react";
import Heading from "../Heading";
import PublicationPost from "@/components/Utility/PublicationPost";
import { getPublicationById } from "@/lib/publications";
import Button from "@/components/Utility/Button";

const Publication = () => {
  const mtm = getPublicationById("measuring-the-unmeasurable");
  const otn = getPublicationById("on-the-notion-of-bandwidth");
  const oti = getPublicationById("on-the-importance-of-thinking-locally");

  return (
    <div className=" bg-white relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <Heading
          title="Publication"
          subtitle="Access our latest journal!"
          icon={<ScrollText size={32} className="inline-block mr-2" />}
        />
        <div>
          {mtm && <PublicationPost {...mtm} />}
          {otn && <PublicationPost {...otn} />}
          {oti && <PublicationPost {...oti} />}
        </div>
        <Button
          href="/publications"
          icon={<ScrollText size={24} className="ml-2" />}
          text="VIEW MORE"
        />
      </div>
    </div>
  );
};

export default Publication;
