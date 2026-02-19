import { ReactNode } from 'react';
import NavbarComponent from '../components/Homepage/NavbarComponent';
import FooterComponent from '../components/Homepage/FooterComponent';
import BackToTopButton from '../components/Homepage/BackToTopButton';

interface HomepageLayoutProps {
  children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponent />
      <BackToTopButton />
      <main className="grow">
        {children}
      </main>
      <FooterComponent />
    </div>
  );
}