'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ServicesProducts() {
  const { t, themeColor } = useLanguage();
  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<{ [key: string]: boolean }>({});

  // Listen for external tab changes
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail.tab);
    };

    window.addEventListener('changeServicesProductsTab', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('changeServicesProductsTab', handleTabChange as EventListener);
    };
  }, []);

  // Handle image loading
  const handleImageLoadStart = (imagePath: string) => {
    setLoadingImages(prev => ({ ...prev, [imagePath]: true }));
  };

  const handleImageLoadComplete = (imagePath: string) => {
    setLoadingImages(prev => ({ ...prev, [imagePath]: false }));
  };

  // Initialize loading state when modal opens
  useEffect(() => {
    if (selectedService) {
      const images = serviceImages[selectedService as keyof typeof serviceImages] || [];
      const initialLoadingState: { [key: string]: boolean } = {};
      images.forEach(imagePath => {
        initialLoadingState[imagePath] = true;
      });
      setLoadingImages(initialLoadingState);
    }
  }, [selectedService]);
  
  const serviceImages = {
    finance: ['/slides/Slide12.jpg', '/slides/Slide13.jpg'],
    legacy: ['/slides/Slide18.jpg', '/slides/Slide19.jpg', '/slides/Slide20.jpg'],
    public: ['/slides/Slide15.jpg', '/slides/Slide16.jpg'],
    salesforce: ['/slides/Slide22.jpg', '/slides/Slide23.jpg', '/slides/Slide24.jpg', '/slides/Slide25.jpg', '/slides/Slide26.jpg', '/slides/Slide27.jpg'],
    fpt: ['/slides/Slide4.jpg', '/slides/Slide5.jpg', '/slides/Slide6.jpg', '/slides/Slide7.jpg', '/slides/Slide8.jpg', '/slides/Slide9.jpg']
  };
  
  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m-3-6h6" />
        </svg>
      ),
      title: t('services.finance.title'),
      description: t('services.finance.desc'),
      features: [t('features.banking_systems'), t('features.insurance_systems'), t('features.securities_systems'), t('features.payment_systems')],
      stats: t('services.finance.stats'),
      domain: "finance"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: t('services.legacy.title'),
      description: t('services.legacy.desc'),
      features: [t('features.cobol_migration'), t('features.db_migration'), t('features.system_modernization'), t('features.legacy_assessment')],
      stats: t('services.legacy.stats'),
      domain: "legacy"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: t('services.public.title'),
      description: t('services.public.desc'),
      features: [t('features.government_systems'), t('features.education_systems'), t('features.smart_city'), t('features.public_infrastructure')],
      stats: t('services.public.stats'),
      domain: "public"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: t('services.salesforce.title'),
      description: t('services.salesforce.desc'),
      features: [t('features.sales_cloud'), t('features.service_cloud'), t('features.mulesoft_integration'), t('features.data_cloud')],
      stats: t('services.salesforce.stats'),
      domain: "salesforce"
    }
  ];

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
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Headers */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 rounded-md text-xl font-bold transition-all duration-200 w-56 whitespace-nowrap ${
                  activeTab === 'services'
                    ? `${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'} text-white shadow-md`
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                私たちのサービス
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 rounded-md text-xl font-bold transition-all duration-200 w-56 whitespace-nowrap ${
                  activeTab === 'products'
                    ? `${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'} text-white shadow-md`
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                主要実績
              </button>
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {activeTab === 'services' ? t('services.subtitle') : t('products.subtitle')}
          </p>
        </div>

        {/* Services Tab Content */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-2 group flex flex-col h-full min-h-[500px]"
              >
                <div className={`flex items-center justify-center w-16 h-16 rounded-lg mb-6 transition-colors duration-300 ${
                  themeColor === 'emerald' 
                    ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">{service.description}</p>
                
                {service.stats && (
                  <div className={`mb-4 text-center py-3 px-3 rounded-lg min-h-[56px] flex items-center justify-center ${
                    themeColor === 'emerald'
                      ? 'bg-gradient-to-r from-emerald-50 to-green-50'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                  }`}>
                    <span 
                      className={`text-sm font-semibold leading-tight ${
                        themeColor === 'emerald' ? 'text-emerald-800' : 'text-blue-800'
                      }`}
                      dangerouslySetInnerHTML={{ __html: service.stats }}
                    />
                  </div>
                )}
                
                <ul className="space-y-2 mb-6 flex-grow">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <div className={`w-full h-1 rounded-full mb-4 ${
                    service.domain === 'finance' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    service.domain === 'legacy' ? 'bg-gradient-to-r from-purple-400 to-violet-500' :
                    service.domain === 'public' ? 'bg-gradient-to-r from-red-400 to-rose-500' :
                    'bg-gradient-to-r from-blue-400 to-cyan-500'
                  }`}></div>
                  
                  <button 
                    onClick={() => setSelectedService(service.domain)}
                    className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-white ${
                      themeColor === 'emerald' 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {t('services.learn_more')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab Content */}
        {activeTab === 'products' && (
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
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Common Call to Action */}
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
                  const headerHeight = 80;
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
        
        {/* Services Modal */}
        {selectedService && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedService(null)}
          >
            <div 
              className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t(`services.${selectedService}.title`)} - {t('services.modal_title')}
                </h3>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {serviceImages[selectedService as keyof typeof serviceImages]?.map((imagePath, index) => (
                  <div key={index} className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
                    {/* Loading Spinner */}
                    {loadingImages[imagePath] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="flex flex-col items-center space-y-2">
                          <div className={`w-8 h-8 border-3 border-gray-300 border-t-3 rounded-full animate-spin ${
                            themeColor === 'emerald' ? 'border-t-emerald-500' : 'border-t-blue-500'
                          }`}></div>
                          <span className="text-sm text-gray-500">Loading...</span>
                        </div>
                      </div>
                    )}
                    <Image
                      src={imagePath}
                      alt={`${selectedService} slide ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      onLoadingComplete={() => handleImageLoadComplete(imagePath)}
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t text-center">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  {t('services.close_modal')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
