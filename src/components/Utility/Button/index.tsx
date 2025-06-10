import Link from 'next/link';

const Button = ({
  href,
  icon,
  text,
  variant = 'primary'
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  variant?: 'primary' | 'outlined';
}) => {
  return (
    <Link
      href={href}
      className={`
        ${
          variant === 'outlined' &&
          `hover:bg-white hover:text-teal-400  border-2 border-white  `
        }
        ${variant === 'primary' && `bg-teal-400 text-white hover:bg-teal-500`}
        transition py-2 flex items-center gap-1 pr-2 rounded-md
      `}
    >
      {icon}
      {text}
    </Link>
  );
};

export default Button;
