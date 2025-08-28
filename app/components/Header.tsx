'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t, themeColor } = useLanguage();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="text-gray-500 text-lx leading-tight mb-1">
                  FPTソフトウェアジャパン株式会社
                </div>
                <div className="flex items-center space-x-3">
                  <img 
                    src="/logo_fpt_text_black.webp" 
                    alt="FPT Software" 
                    className="h-10 w-auto"
                  />
                  <img 
                    src="/logo.png" 
                    alt="FSG - Finance Services Group" 
                    className="h-10 w-auto relative z-10"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                  const headerHeight = 80;
                  const elementPosition = aboutSection.offsetTop - headerHeight;
                  window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`text-gray-700 transition-colors whitespace-nowrap ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
            >
              {t('nav.about')}
            </button>
            <button 
              onClick={() => {
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                  const headerHeight = 80;
                  const elementPosition = servicesSection.offsetTop - headerHeight;
                  window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`text-gray-700 transition-colors whitespace-nowrap ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
            >
              {t('nav.services')}
            </button>
            <button 
              onClick={() => {
                const globalSection = document.getElementById('global-network');
                if (globalSection) {
                  const headerHeight = 80;
                  const elementPosition = globalSection.offsetTop - headerHeight;
                  window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`text-gray-700 transition-colors whitespace-nowrap ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
            >
              {t('nav.global')}
            </button>
            <button 
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  const headerHeight = 80;
                  const elementPosition = contactSection.offsetTop - headerHeight;
                  window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`text-gray-700 transition-colors whitespace-nowrap ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
            >
              {t('nav.contact')}
            </button>
          </nav>

          {/* Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher - Fixed width */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 w-[100px] shrink-0">
              <button
                onClick={() => setLanguage('jp')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 text-center ${
                  language === 'jp'
                    ? `${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'} text-white`
                    : `text-gray-600 ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`
                }`}
              >
                JP
              </button>
              <button
                onClick={() => setLanguage('vn')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 text-center ${
                  language === 'vn'
                    ? `${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'} text-white`
                    : `text-gray-600 ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`
                }`}
              >
                VN
              </button>
            </div>
            
            {/* CTA Button - Fixed width */}
            <div className="w-[140px] shrink-0">
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    const headerHeight = 80; // Chiều cao của header
                    const elementPosition = contactSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-center text-sm block w-full ${
                  themeColor === 'emerald' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {t('nav.consultation')}
              </button>
            </div>

            {/* Admin Login Button */}
            <div className="w-[120px] shrink-0">
              <Link
                href="/admin"
                className={`text-gray-600 hover:text-gray-800 px-2 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors whitespace-nowrap text-center text-xs block w-full ${
                  themeColor === 'emerald' 
                    ? 'hover:text-emerald-600 hover:border-emerald-300' 
                    : 'hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                管理者ログイン
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    const headerHeight = 80;
                    const elementPosition = aboutSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className={`text-gray-700 transition-colors text-left ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    const headerHeight = 80;
                    const elementPosition = servicesSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className={`text-gray-700 transition-colors text-left ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
              >
                {t('nav.services')}
              </button>
              <button
                onClick={() => {
                  const globalSection = document.getElementById('global-network');
                  if (globalSection) {
                    const headerHeight = 80;
                    const elementPosition = globalSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className={`text-gray-700 transition-colors text-left ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
              >
                {t('nav.global')}
              </button>
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    const headerHeight = 80;
                    const elementPosition = contactSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className={`text-gray-700 transition-colors text-left ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`}
              >
                {t('nav.contact')}
              </button>
              
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-center bg-gray-100 rounded-lg p-1 mx-4">
                <button
                  onClick={() => {
                    setLanguage('jp');
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === 'jp'
                      ? `${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'} text-white`
                      : `text-gray-600 ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`
                  }`}
                >
                  JP
                </button>
                <button
                  onClick={() => {
                    setLanguage('vn');
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === 'vn'
                      ? `${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'} text-white`
                      : `text-gray-600 ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-blue-600'}`
                  }`}
                >
                  VN
                </button>
              </div>
              
              <button
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    const headerHeight = 80; // Chiều cao của header
                    const elementPosition = contactSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                  setIsMenuOpen(false);
                }}
                className={`text-white px-6 py-2 rounded-lg transition-colors text-center mx-4 block ${
                  themeColor === 'emerald' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {t('nav.consultation')}
              </button>

              {/* Mobile Admin Login */}
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors text-center mx-4 block ${
                  themeColor === 'emerald' 
                    ? 'hover:text-emerald-600 hover:border-emerald-300' 
                    : 'hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                管理者ログイン
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
