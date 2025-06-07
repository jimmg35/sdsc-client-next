import React from "react";

const Heading = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => {
  return (
    <h1 className="text-4xl font-bold flex flex-col items-center justify-center">
      <div>
        {icon}
        {title}
      </div>
      <p className="text-lg">{subtitle}</p>
    </h1>
  );
};

export default Heading;
