import { ReactNode } from 'react';
import NavbarComponent from '../components/Homepage/NavbarComponent';
import FooterComponent from '../components/Homepage/FooterComponent';

interface HomepageLayoutProps {
  children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponent />
      <main className="grow">
        {children}
      </main>
      <FooterComponent />
    </div>
  );
}