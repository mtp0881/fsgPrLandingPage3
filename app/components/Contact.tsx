'use client';

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t, themeColor } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    const message = t('language') === 'jp' ? 
      'お問い合わせありがとうございます！24時間以内にご回答いたします。' : 
      'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.';
    alert(message);
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {t('contact.info.title')}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    themeColor === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      themeColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t('contact.address')}</h4>
                    <p className="text-gray-600">〒105-0011 東京都港区芝公園1-7-6</p>
                    <p className="text-gray-600">KDX浜松町プレイス6階（受付：5階）</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    themeColor === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      themeColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t('contact.phone')}</h4>
                    <p className="text-gray-600">TEL: 03-6634-6868</p>
                    <p className="text-gray-600">FAX: 03-6634-6869</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    themeColor === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      themeColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.703a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t('contact.email')}</h4>
                    <p className="text-gray-600">fsg@fpt-software.jp</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    themeColor === 'emerald' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      themeColor === 'emerald' ? 'text-emerald-600' : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t('contact.hours')}</h4>
                    <p className="text-gray-600">{t('contact.hours.weekday')}</p>
                    <p className="text-gray-600">{t('contact.hours.saturday')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 ${
                        themeColor === 'emerald' 
                          ? 'focus:ring-emerald-500 focus:border-emerald-500' 
                          : 'focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder={t('contact.form.placeholder.name')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 ${
                        themeColor === 'emerald' 
                          ? 'focus:ring-emerald-500 focus:border-emerald-500' 
                          : 'focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder={t('contact.form.placeholder.email')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 ${
                        themeColor === 'emerald' 
                          ? 'focus:ring-emerald-500 focus:border-emerald-500' 
                          : 'focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder={t('contact.form.placeholder.phone')}
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 ${
                        themeColor === 'emerald' 
                          ? 'focus:ring-emerald-500 focus:border-emerald-500' 
                          : 'focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder={t('contact.form.placeholder.company')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.service')}
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 ${
                      themeColor === 'emerald' 
                        ? 'focus:ring-emerald-500 focus:border-emerald-500' 
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  >
                    <option value="">{t('contact.form.select_service')}</option>
                    <option value="finance">{t('services.finance.title')}</option>
                    <option value="legacy">{t('services.legacy.title')}</option>
                    <option value="public">{t('services.public.title')}</option>
                    <option value="salesforce">{t('services.salesforce.title')}</option>
                    <option value="other">{t('contact.form.service.other')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 text-gray-900 ${
                      themeColor === 'emerald' 
                        ? 'focus:ring-emerald-500 focus:border-emerald-500' 
                        : 'focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    placeholder={t('contact.form.placeholder.message')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className={`w-full text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                    themeColor === 'emerald' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {t('contact.form.submit')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
