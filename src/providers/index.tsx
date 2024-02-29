'use client';

import { ToastProvider } from '@/providers/implementations/ToastProvider';
import NextSessionProvider from './implementations/NextSessionProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ToastProvider />
      <NextSessionProvider>{children}</NextSessionProvider>
    </>
  );
};

export default Providers;
