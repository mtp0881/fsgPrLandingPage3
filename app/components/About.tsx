'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t, themeColor } = useLanguage();

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="text-center p-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              themeColor === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100'
            }`}>
              <svg className={`w-8 h-8 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.mission.title')}</h3>
            <p className="text-gray-600">
              {t('about.mission.desc')}
            </p>
          </div>

          {/* Vision */}
          <div className="text-center p-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              themeColor === 'emerald' ? 'bg-green-100' : 'bg-green-100'
            }`}>
              <svg className={`w-8 h-8 ${themeColor === 'emerald' ? 'text-green-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.vision.title')}</h3>
            <p className="text-gray-600">
              {t('about.vision.desc')}
            </p>
          </div>

          {/* Values */}
          <div className="text-center p-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              themeColor === 'emerald' ? 'bg-teal-100' : 'bg-purple-100'
            }`}>
              <svg className={`w-8 h-8 ${themeColor === 'emerald' ? 'text-teal-600' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('about.values.title')}</h3>
            <p className="text-gray-600">
              {t('about.values.desc')}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">{t('about.stats.finance_engineers')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">200+</div>
            <div className="text-gray-600">{t('about.stats.legacy_projects')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">15</div>
            <div className="text-gray-600">{t('about.stats.public_locations')}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">200+</div>
            <div className="text-gray-600">{t('about.stats.salesforce_specialists')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
