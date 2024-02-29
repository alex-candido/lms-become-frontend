import { SessionProvider } from 'next-auth/react';

interface NextSessionProviderProps {
  children: React.ReactNode;
}

const NextSessionProvider: React.FC<NextSessionProviderProps> = ({
  children,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextSessionProvider;
