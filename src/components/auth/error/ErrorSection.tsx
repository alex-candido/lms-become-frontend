import Link from 'next/link';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface ErrorSectionProps extends ComponentProps<'div'> {}

const ErrorSection: React.FC<ErrorSectionProps> = ({ className, ...props }) => {
  return (
    <div className={twMerge('lms-error-section h-full', className)} {...props}>
      ErrorSection
      <Link href={'/auth/sign-in'} className="flex items-center gap-2">Go to Sign-in</Link>
    </div>
  );
};

export default ErrorSection;
