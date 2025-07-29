import React from 'react';

const Heading = ({
  // icon,
  title
  // subtitle,
  // variant = 'default'
}: {
  // icon: React.ReactNode;
  title: string;
  // subtitle: string;
  variant?: 'default' | 'secondary';
}) => {
  return (
    <h1 className="text-4xl font-bold flex  gap-2 flex-col items-center justify-center">
      <div>
        {/* {icon} */}
        {title}
      </div>
      {/* <div
        className={`${
          variant === 'default' ? 'bg-teal-100' : 'bg-white'
        } py-2 px-4 rounded-md shadow-md`}
      >
        <p className="text-lg">{subtitle}</p>
      </div> */}
    </h1>
  );
};

export default Heading;
