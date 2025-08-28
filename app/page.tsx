'use client';

import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import ServicesProducts from './components/ServicesProducts';
import GlobalNetwork from './components/GlobalNetwork';
import Partners from './components/Partners';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useLanguage } from './contexts/LanguageContext';

export default function Home() {
  const { } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <ServicesProducts />
        <Partners />
        <GlobalNetwork />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
