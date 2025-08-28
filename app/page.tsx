'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 500); // Small delay before hiding loading screen
          return 100;
        }
        return prev + Math.random() * 15; // Random increment for realistic loading
      });
    }, 200);

    // Minimum loading time
    const minLoadTime = setTimeout(() => {
      setLoadingProgress(100);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(minLoadTime);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Main content - always rendered but hidden during loading */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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

      {/* Loading Screen Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center max-w-md mx-auto px-6">
            {/* Company Logo */}
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-8 mb-6">
                {/* FPT Logo */}
                <div className="w-48 h-32 flex items-center justify-center">
                  <Image
                    src="/logo_fpt_text_black.webp"
                    alt="FPT Software Japan"
                    width={192}
                    height={128}
                    className="object-contain"
                    priority
                  />
                </div>
                
                {/* FSG Logo */}
                <div className="w-32 h-32 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="FSG Logo"
                    width={128}
                    height={128}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <p className="text-1xl text-gray-400">
                FPTソフトウェアジャパン株式会社
              </p>
              <br />
              {/* Department */}
              <p className="text-xl text-gray-700 font-semibold">
                FSG事業部公開サイト
              </p>
            </div>

            {/* Loading Animation */}
            <div className="mb-6">
              <div className="w-8 h-8 mx-auto mb-3">
                <div className="w-full h-full border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-500 text-sm font-medium">
                コンテンツを初期化中...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
