'use client';

import { ComponentProps, useCallback, useState } from 'react';

import { toast } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import AuthForm from '@/components/forms/AuthForm';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Input from '@/components/ui/Input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SignInSectionSectionProps extends ComponentProps<'div'> {}

const SignInSection: React.FC<SignInSectionSectionProps> = ({
  className,
  ...props
}) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await signIn('credentials', {
        email,
        password,
      })

      toast.success('Logged in');
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  const footerContent = (
    <div className="text-neutral-400 text-center">
      <p>First time using LMS?</p>
      <span
        onClick={() => router.push(`/sign-up`)}
        className="text-white cursor-pointer hover:underline"
      >
        Create an account
      </span>
    </div>
  );

  return (
    <div className={twMerge('lms-sign-in-section h-full', className)} {...props}>
      <Container>
        <Section>
          <div className="sign-in-container w-full h-full flex justify-center items-center">
            <AuthForm
              title="Login"
              actionLabel="Sign in"
              disabled={isLoading}
              onSubmit={onSubmit}
              footer={footerContent}
            >
              <Input
                placeholder="Email"
                type="email"
                onChange={e => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
              />
              <Input
                placeholder="Password"
                type="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
              />
            </AuthForm>
          </div>
        </Section>
      </Container>
    </div>
  );
};

export default SignInSection;
