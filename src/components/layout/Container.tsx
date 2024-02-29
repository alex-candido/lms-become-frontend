import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface ContainerProps extends ComponentProps<'div'> {}

const Container: React.FC<ContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={twMerge('lms-container w-full h-full mx-auto max-w-[80%]', className)} {...props}>
      {children}
    </div>
  )
}

export default Container
