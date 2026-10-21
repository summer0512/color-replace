import { ReactNode } from 'react';

type Props = { children: ReactNode };

// Production script loading lives in ProductionScripts, independently of ads.
export default function RootLayout({ children }: Props) {
  return <>{children}</>;
}
