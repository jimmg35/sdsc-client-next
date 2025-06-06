const Banner = ({
  title,
  icon,
  imageUrl,
}: {
  title: string;
  icon: React.ReactNode;
  imageUrl?: string;
}) => {
  return (
    <div
      className={`h-[300px] relative w-full top-0 left-0 bg-teal-400 bg-center bg-no-repeat bg-covers`}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      <div className="flex items-center justify-center bg-white absolute bottom-0 w-[26%] text-teal-400 mb-0 rounded-tr-[5px] rounded-bl-none rounded-tl-none rounded-br-none py-[20px] pb-[18px] max-h-[108px] min-w-[300px] text-center">
        {icon}
        <h1 className="text-5xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default Banner;
