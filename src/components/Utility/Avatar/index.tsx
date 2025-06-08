import Image from 'next/image';

const Avatar = ({ src, size }: { src: string; size: number }) => {
  return (
    <>
      <Image
        src={src}
        width={size}
        height={size}
        alt="Dummy Image"
        className="rounded-full aspect-square object-cover border-2 border-teal-400"
      />
    </>
  );
};

export default Avatar;
