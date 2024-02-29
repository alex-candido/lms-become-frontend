import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface SectionProps extends ComponentProps<'div'>{}

const Section: React.FC<SectionProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={twMerge('lms-section w-full h-full py-8', className)} {...props}>
      {children}
    </div>
  )
}

export default Section
