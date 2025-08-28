'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function Hero() {
  const { t, themeColor } = useLanguage();

  return (
    <section 
      className={`py-20 relative overflow-hidden`}
      style={{
        backgroundImage: `url('/images/hero-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay - blur effect */}
      <div className={`absolute inset-0 bg-black/20 backdrop-blur-[2px]`}></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-2xl" style={{textShadow: '6px 6px 12px rgba(0,0,0,1), 4px 4px 8px rgba(0,0,0,0.9), 2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.7)'}}>
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed drop-shadow-lg" style={{textShadow: '5px 5px 10px rgba(0,0,0,1), 3px 3px 6px rgba(0,0,0,0.9), 1px 1px 2px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.6)'}}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    const headerHeight = 80; // Chiều cao của header
                    const elementPosition = aboutSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg ${
                  themeColor === 'emerald' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,0.6)'}}
              >
                {t('hero.explore')}
              </button>
              <button 
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    const headerHeight = 80; // Chiều cao của header
                    const elementPosition = servicesSection.offsetTop - headerHeight;
                    window.scrollTo({
                      top: elementPosition,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg ${
                  themeColor === 'emerald' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7), 1px 1px 2px rgba(0,0,0,0.6)'}}
              >
                {t('hero.demo')}
              </button>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className={`aspect-video rounded-lg flex items-center justify-center ${
                themeColor === 'emerald' 
                  ? 'bg-gradient-to-br from-emerald-100 to-green-100' 
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
              }`}>
                <div className="text-center">
                  <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    themeColor === 'emerald' 
                      ? 'bg-gradient-to-r from-emerald-900 to-green-700' 
                      : 'bg-gradient-to-r from-blue-900 to-indigo-700'
                  }`}>
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">FSG事業部</h3>
                  <p className="text-gray-600 mt-2">デジタル変革のエキスパート</p>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                    <div className="bg-green-300 text-green-700 px-2 py-1 rounded border border-green-500">金融</div>
                    <div className="bg-red-100 text-red-700 px-2 py-1 rounded border border-red-500">公共</div>
                    <div className="bg-purple-300 text-purple-700 px-2 py-1 rounded border border-purple-500">レガシー</div>
                    <div className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded border border-cyan-500">Salesforce</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium text-gray-900">{t('hero.uptime')}</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                <span className="text-sm font-medium text-gray-900">{t('hero.support')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
