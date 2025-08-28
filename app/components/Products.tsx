'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function Products() {
  const { t, themeColor } = useLanguage();
  
  const products = [
    {
      name: t('products.finance.name'),
      description: t('products.finance.desc'),
      features: [t('products.finance.feature1'), t('products.finance.feature2'), t('products.finance.feature3'), t('products.finance.feature4')],
      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m-3-6h6',
      bgColor: 'from-green-100 to-emerald-100',
      iconColor: 'bg-green-600'
    },
    {
      name: t('products.legacy.name'),
      description: t('products.legacy.desc'),
      features: [t('products.legacy.feature1'), t('products.legacy.feature2'), t('products.legacy.feature3'), t('products.legacy.feature4')],
      icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
      bgColor: 'from-purple-100 to-violet-100',
      iconColor: 'bg-purple-600'
    },
    {
      name: t('products.public.name'),
      description: t('products.public.desc'),
      features: [t('products.public.feature1'), t('products.public.feature2'), t('products.public.feature3'), t('products.public.feature4')],
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      bgColor: 'from-red-100 to-rose-100',
      iconColor: 'bg-red-600'
    },
    {
      name: t('products.salesforce.name'),
      description: t('products.salesforce.desc'),
      features: [t('products.salesforce.feature1'), t('products.salesforce.feature2'), t('products.salesforce.feature3'), t('products.salesforce.feature4')],
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      bgColor: 'from-cyan-100 to-blue-100',
      iconColor: 'bg-cyan-600'
    }
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('products.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
              {/* Product Header */}
              <div className={`h-48 bg-gradient-to-br ${product.bgColor} flex items-center justify-center`}>
                <div className="text-center">
                  <div className={`w-20 h-20 ${product.iconColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={product.icon} />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-700">{product.name}</h4>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>

                {/* Features */}
                <div className="mb-6 flex-grow">
                  <h4 className="font-medium text-gray-900 mb-2">{t('products.main_achievements')}:</h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="mt-auto hidden">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm rounded-lg transition-colors">
                    {t('products.demo')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className={`rounded-2xl p-8 ${
            themeColor === 'emerald' 
              ? 'bg-gradient-to-r from-emerald-50 to-green-100' 
              : 'bg-gradient-to-r from-blue-50 to-indigo-100'
          }`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('products.custom.title')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('products.custom.desc')}
            </p>
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
              className={`text-white px-8 py-3 rounded-lg transition-colors ${
                themeColor === 'emerald' 
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {t('products.custom.contact')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
