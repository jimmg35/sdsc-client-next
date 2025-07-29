import Button from '@/components/Utility/Button';
import PublicationPost from '@/components/Utility/PublicationPost';
import { getPublicationById } from '@/lib/publications';
import { ScrollText } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
import Heading from '../Heading';

const Publication = () => {
  const mtm = getPublicationById('measuring-the-unmeasurable');
  const otn = getPublicationById('on-the-notion-of-bandwidth');
  const oti = getPublicationById('on-the-importance-of-thinking-locally');

  return (
    <div className=" bg-white relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <Fade direction="down" cascade triggerOnce>
          <Heading
            title="Publication"
            // subtitle="Access our latest journal!"
            // icon={<ScrollText size={32} className="inline-block mr-2" />}
          />
        </Fade>

        <Fade direction="up" cascade triggerOnce>
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
        </Fade>
      </div>
    </div>
  );
};

export default Publication;
