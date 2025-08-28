'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t, themeColor } = useLanguage();

  return (
    <footer className={`text-white py-12 ${
      themeColor === 'emerald' ? 'bg-emerald-950' : 'bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className={`text-2xl font-bold mb-4 ${
              themeColor === 'emerald' ? 'text-emerald-400' : 'text-blue-400'
            }`}>
              FSG Department
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="text-sm text-gray-400 mb-6">
              <p>{t('footer.company')}</p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="https://jp.linkedin.com/company/fptjapanholdings" target="_blank" rel="noopener noreferrer" className={`w-10 h-10 text-white rounded-lg flex items-center justify-center transition-colors ${
                themeColor === 'emerald' 
                  ? 'bg-emerald-400 hover:bg-emerald-500' 
                  : 'bg-blue-400 hover:bg-blue-500'
              }`}>
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://fptsoftware.jp/about-us/fpt-japan" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-600 text-white rounded-lg flex items-center justify-center hover:bg-gray-500 transition-colors">
                <span className="sr-only">Website</span>
                <img 
                  src="/image17.png" 
                  alt="Website" 
                  className="w-6 h-6 object-contain"
                />
              </a>
            </div>
          </div>
          
          {/* Business Domains */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.business_domains')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#services" className="hover:text-white transition-colors">{t('services.finance.title')}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{t('services.legacy.title')}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{t('services.public.title')}</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">{t('services.salesforce.title')}</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="text-sm">
                <div>〒105-0011</div>
                <div>東京都港区芝公園1-7-6</div>
                <div>KDX浜松町プレイス6階</div>
              </li>
              <li className="text-sm mt-3">
                <div>TEL: 03-6634-6868</div>
                <div>FAX: 03-6634-6869</div>
              </li>
              <li className="text-sm">
                fsg@fpt-software.jp
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className={`mt-8 pt-8 text-center text-gray-400 ${
          themeColor === 'emerald' ? 'border-t border-emerald-900' : 'border-t border-gray-800'
        }`}>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
