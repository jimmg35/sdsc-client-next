import React from 'react';

type HeadingProps = {
  title: string;
  variant?: 'default' | 'secondary';
};

const Heading = ({ title, variant = 'default' }: HeadingProps) => {
  const baseClass = 'text-3xl font-semibold tracking-tight md:text-4xl';
  const variantClass =
    variant === 'secondary' ? 'text-gold-300' : 'text-gold-50 text-glow';

  return <h2 className={`${baseClass} ${variantClass}`}>{title}</h2>;
};

export default Heading;
