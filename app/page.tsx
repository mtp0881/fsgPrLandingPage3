'use client';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Products from './components/Products';
import GlobalNetwork from './components/GlobalNetwork';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useLanguage } from './contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Partners />
        <Products />
        <GlobalNetwork />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
