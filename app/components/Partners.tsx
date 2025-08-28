'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../hooks/useContent';
import Image from 'next/image';

export default function Partners() {
  const { t, themeColor } = useLanguage();
  const { content, loading, error } = useContent();

  const partners = [
    // Main Partners (larger display)
    {
      name: 'NTT Data',
      logo: '/partners/ntt-data--600.png',
      width: 200,
      height: 100,
      isMain: true
    },
    {
      name: 'Partner 596797',
      logo: '/partners/596797.png',
      width: 160,
      height: 80,
      isMain: true
    },
    {
      name: 'Fujitsu',
      logo: '/partners/fujitsu.webp',
      width: 180,
      height: 90,
      isMain: true
    }
  ];

  const secondaryPartners = [
    {
      name: 'Deutsche Bank',
      logo: '/partners/deutsche-bank.webp',
      width: 120,
      height: 60
    },
    {
      name: 'Closing Exchange',
      logo: '/partners/closing exchange.webp',
      width: 120,
      height: 60
    },
    {
      name: 'DocMagic',
      logo: '/partners/docmagic.webp',
      width: 120,
      height: 60
    },
    {
      name: 'Symphony',
      logo: '/partners/symphony.webp',
      width: 120,
      height: 60
    },
    {
      name: 'Item LV2',
      logo: '/partners/item_lv2.webp',
      width: 120,
      height: 60
    }
  ];

  if (loading) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-orange-100 to-green-100"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
              themeColor === 'emerald' ? 'border-emerald-600' : 'border-blue-600'
            }`}></div>
          </div>
        </div>
      </section>
    );
  }

  const partnersContent = content?.partners || {};

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with smooth transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 via-orange-100 to-green-100"></div>
      
      {/* Floating shapes for visual interest */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-orange-300 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 bg-green-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-200 rounded-full blur-md"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {partnersContent.title || t('partners.title')}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {partnersContent.subtitle || t('partners.subtitle')}
          </p>
        </div>

        {/* Main Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-items-center mb-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center h-32 w-full"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="object-contain transition-transform duration-300 hover:scale-105 max-w-full max-h-full"
                  style={{ maxWidth: '90%', maxHeight: '90%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch justify-items-center">
          {secondaryPartners.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-20 w-full"
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  className="object-contain transition-transform duration-300 hover:scale-105 max-w-full max-h-full"
                  style={{ maxWidth: '85%', maxHeight: '85%' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Partners Text */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            {partnersContent.additional || t('partners.additional')}
          </p>
        </div>
      </div>
    </section>
  );
}
