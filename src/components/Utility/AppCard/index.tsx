import Image from 'next/image';

const AppCard = ({
  title,
  description,
  imageUrl
}: {
  title: string;
  description: string;
  imageUrl: string;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:bg-gray-300 transition">
      <Image src={imageUrl} alt="App Card" width={72} height={72} />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default AppCard;
