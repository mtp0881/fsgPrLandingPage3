'use client';

import WorldMap from './WorldMap';
import { useLanguage } from '../contexts/LanguageContext';

export default function GlobalNetwork() {
  const { t, language } = useLanguage();

  return (
    <section id="global-network" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'vn' ? 'Mạng Lưới Toàn Cầu' : 'グローバルネットワーク'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {language === 'vn' 
              ? 'FPT Software có mặt tại 30 quốc gia với 86 văn phòng trên toàn cầu, mang đến dịch vụ chất lượng cao cho khách hàng quốc tế'
              : 'FPTソフトウェアは世界30カ国・地域に86のオフィスを展開し、グローバルなお客様に高品質なサービスを提供しています'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Global Presence Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'vn' ? 'Hiện Diện Toàn Cầu' : 'グローバル展開'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-gray-600">
                      {language === 'vn' ? 'Văn phòng Nhật Bản' : '日本国内拠点'}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-red-600">30</div>
                    <div className="text-sm text-gray-600">
                      {language === 'vn' ? 'Quốc gia/Vùng lãnh thổ' : '国・地域'}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="text-2xl font-bold text-green-600">86</div>
                    <div className="text-sm text-gray-600">
                      {language === 'vn' ? 'Tổng số văn phòng' : '総オフィス数'}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'vn' ? 'Năng Lực Toàn Cầu' : 'グローバル能力'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'vn' ? 'Nhà nghiên cứu AI' : 'AI研究者'}
                  </span>
                  <span className="font-semibold text-blue-600">20K+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'vn' ? 'Kỹ sư tài chính' : '金融エンジニア'}
                  </span>
                  <span className="font-semibold text-green-600">500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'vn' ? 'Chuyên gia Salesforce' : 'Salesforce専門家'}
                  </span>
                  <span className="font-semibold text-purple-600">200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'vn' ? 'Trung tâm phát triển' : '開発センター'}
                  </span>
                  <span className="font-semibold text-red-600">18+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    {language === 'vn' ? 'Đối tác AI quốc tế' : 'AIパートナー'}
                  </span>
                  <span className="font-semibold text-indigo-600">5+</span>
                </div>
              </div>
            </div>
          </div>

          {/* World Map */}
          <div className="lg:col-span-2">
            <WorldMap />
          </div>
        </div>

        {/* Global Services Features */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'vn' ? 'Trung tâm AI Quy Nhơn' : 'クイニョンAIセンター'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'vn' 
                ? '94,000m² với 20,000 nhà nghiên cứu AI'
                : '94,000㎡敷地・20,000人AI研究者'
              }
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'vn' ? 'Đối tác AI hàng đầu' : 'AIパートナーシップ'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'vn' 
                ? 'NVIDIA, Mila, Landing AI, IBM, Meta'
                : 'NVIDIA・Mila・Landing AI・IBM・Meta'
              }
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'vn' ? 'Triển khai toàn cầu' : 'グローバル展開'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'vn' 
                ? '30 quốc gia với 86 văn phòng và trung tâm'
                : '30カ国・地域86オフィス・センター'
              }
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'vn' ? 'Chất lượng quốc tế' : '国際品質基準'}
            </h4>
            <p className="text-sm text-gray-600">
              {language === 'vn' 
                ? 'ISO/IEC 27001, CMMI Level 5, SOC2'
                : 'ISO/IEC 27001・CMMI Level 5・SOC2'
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
