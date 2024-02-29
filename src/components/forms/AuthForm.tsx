import React, { ComponentProps, useCallback } from 'react';

import { signIn } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

import Button from '../ui/Button';
import Card from '../ui/Card';

interface AuthFormProps extends ComponentProps<'div'> {
  title?: string;
  onSubmit: () => void;
  actionLabel: string;
  disabled?: boolean;
  footer?: React.ReactElement;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onSubmit,
  title,
  actionLabel,
  disabled,
  className,
  footer,
  children,
  ...props
}) => {
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [disabled, onSubmit]);

  return (
    <div
      className={twMerge('lms-auth-form w-full max-w-lg', className)}
      {...props}
    >
      <Card>
        <div className="auth-container flex flex-col gap-4">
          <div className="auth-header">
            <div className="header-content">
              <span className="title text-xl font-semibold text-white">
                {title}
              </span>
            </div>
          </div>
          <div className="auth-body">
            <div className="body-content flex flex-col gap-4">{children}</div>
          </div>
          <div className="auth-footer">
            <div className="footer-content flex flex-col gap-4">
              <Button
                disabled={disabled}
                label={actionLabel}
                secondary
                fullWidth
                onClick={handleSubmit}
              />
              <Button
                disabled={disabled}
                label={'With Google'}
                fullWidth
                onClick={() => {
                  signIn('google').catch(console.error);
                }}
              />
              {footer}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
