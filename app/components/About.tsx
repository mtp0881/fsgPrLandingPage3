'use client';

import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useContent } from '../../hooks/useContent';

export default function About() {
  const { t, themeColor } = useLanguage();
  const { content, loading } = useContent();
  const [showFptModal, setShowFptModal] = useState(false);
  const [loadingImages, setLoadingImages] = useState<{ [key: number]: boolean }>({});
  
  // Get FPT images from content instead of hardcoded
  const fptImages = useMemo(() => {
    if (!content || !content.slides || !content.slides.fpt) {
      return [
        '/slides/Slide4.jpg', 
        '/slides/Slide5.jpg', 
        '/slides/Slide6.jpg', 
        '/slides/Slide7.jpg', 
        '/slides/Slide8.jpg', 
        '/slides/Slide9.jpg'
      ];
    }
    return content.slides.fpt;
  }, [content]);

  const handleImageLoadStart = (index: number) => {
    setLoadingImages(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoadComplete = (index: number) => {
    setLoadingImages(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index: number) => {
    setLoadingImages(prev => ({ ...prev, [index]: false }));
  };

  // Initialize loading state when modal opens
  useEffect(() => {
    if (showFptModal) {
      const initialLoadingState: { [key: number]: boolean } = {};
      fptImages.forEach((_: string, index: number) => {
        initialLoadingState[index] = true;
      });
      setLoadingImages(initialLoadingState);
    }
  }, [showFptModal, fptImages]);

  if (loading || !content) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">コンテンツを読み込み中...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.about.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            <button
              onClick={() => setShowFptModal(true)}
              className="text-blue-600 hover:text-blue-800 underline font-semibold transition-colors"
            >
              FPTソフトウェアジャパン
            </button>
            のファイナンスサービス開発事業部として、金融・公共・レガシー・Salesforceの4つの専門分野で日本のデジタル変革をリードしています。
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{content.about.mission.title}</h3>
            <p className="text-gray-600">
              {content.about.mission.desc}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{content.about.vision.title}</h3>
            <p className="text-gray-600">
              {content.about.vision.desc}
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{content.about.values.title}</h3>
            <p className="text-gray-600">
              {content.about.values.desc}
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

      {/* FPT Modal */}
      {showFptModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFptModal(false)}
        >
          <div 
            className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">
                FPTソフトウェアジャパン - 会社紹介
              </h3>
              <button 
                onClick={() => setShowFptModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {fptImages.map((imagePath: string, index: number) => (
                <div key={index} className="relative w-full h-[700px] rounded-lg overflow-hidden shadow-lg">
                  {loadingImages[index] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="flex flex-col items-center space-y-4">
                        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                          themeColor === 'emerald' ? 'border-emerald-600' : 'border-blue-600'
                        }`}></div>
                        <p className={`text-sm font-medium ${
                          themeColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>
                          画像を読み込み中...
                        </p>
                      </div>
                    </div>
                  )}
                  <Image
                    src={imagePath}
                    alt={`FPT Software Japan slide ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    onLoad={() => handleImageLoadComplete(index)}
                    onError={() => handleImageError(index)}
                  />
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t text-center">
              <button 
                onClick={() => setShowFptModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
