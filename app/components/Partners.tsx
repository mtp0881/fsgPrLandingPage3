'use client';

import { useLanguage } from '../contexts/LanguageContext';
import Image from 'next/image';

export default function Partners() {
  const { t } = useLanguage();

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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {t('partners.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('partners.subtitle')}
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
          <p className="text-gray-500 text-sm">
            {t('partners.additional')}
          </p>
        </div>
      </div>
    </section>
  );
}
