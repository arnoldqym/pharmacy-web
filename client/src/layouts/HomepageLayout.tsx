import React from 'react';
import NavbarComponent from '../components/Homepage/NavbarComponent';
import FooterComponent from '../components/Homepage/FooterComponent';

export default function HomepageLayout({ children }) {
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