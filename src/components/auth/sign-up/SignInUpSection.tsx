'use client';

import { ComponentProps, useCallback, useState } from 'react';

import { toast } from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import AuthForm from '@/components/forms/AuthForm';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import Input from '@/components/ui/Input';

import { createUser } from '@/redux/actions/users/post-create-user';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SignInUpSectionProps extends ComponentProps<'div'> {}

const SignInUpSection: React.FC<SignInUpSectionProps> = ({
  className,
  ...props
}) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await createUser({ name, email, password, username });

      console.log({ name, email, password, username });

      setIsLoading(false);

      toast.success('Account created.');

      await signIn('credentials', {
        email,
        password,
      });
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, username, name]);

  const footerContent = (
    <div className="text-neutral-400 text-center">
      <p>Already have an account?</p>
      <span
        onClick={() => router.push(`/auth/sign-in`)}
        className="text-white cursor-pointer hover:underline"
      >
        Sing in
      </span>
    </div>
  );

  return (
    <div
      className={twMerge('lms-sign-in-up-section h-full', className)}
      {...props}
    >
      <Container>
        <Section>
          <div className="sign-in-container w-full h-full flex justify-center items-center">
            <AuthForm
              title="Create an account"
              actionLabel="Sign Up"
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
                placeholder="Name"
                type="text"
                onChange={e => setName(e.target.value)}
                value={name}
                disabled={isLoading}
              />
              <Input
                placeholder="Username"
                type="text"
                onChange={e => setUsername(e.target.value)}
                value={username}
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

export default SignInUpSection;
