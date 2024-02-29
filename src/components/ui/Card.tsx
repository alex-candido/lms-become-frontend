import React, { ComponentProps } from "react";
import { twMerge } from 'tailwind-merge';

interface CardProps extends ComponentProps<'div'> {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={twMerge('lms-card p-6 px-6 rounded-xl shadow-lg bg-black outline-none focus:outline-none border-2 border-neutral-800', className)} {...props}>
    { children }
    </div>
  )
};

export default Card;
