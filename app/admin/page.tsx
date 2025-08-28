'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Login from '../components/Login';

interface ContentData {
  jp: any;
  vn: any;
}

export default function AdminPanel() {
  const { language, setLanguage } = useLanguage();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('adminLoggedIn');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (loggedIn === 'true' && loginTime) {
        // Check if login is still valid (24 hours)
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(loginTime);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (timeDiff < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Session expired
          localStorage.removeItem('adminLoggedIn');
          localStorage.removeItem('adminLoginTime');
        }
      }
    };
    
    checkAuth();
  }, []);

  // Load content on mount (only after authentication)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadContent = async () => {
      try {
        const response = await fetch('/api/content');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error loading content:', error);
        setMessage('エラー: コンテンツの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
    setContent(null);
    setLoading(true);
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const updateContent = (section: string, field: string, value: string | any[], subField?: string) => {
    if (!content) return;
    
    setContent(prev => {
      if (!prev) return prev;
      
      const newContent = { ...prev };
      
      // Ensure the section exists
      if (!newContent[language][section]) {
        newContent[language][section] = {};
      }
      
      if (subField) {
        if (!newContent[language][section][field]) {
          newContent[language][section][field] = {};
        }
        newContent[language][section][field][subField] = value;
      } else {
        newContent[language][section][field] = value;
      }
      return newContent;
    });
  };

  const saveContent = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.warning) {
          setMessage(`⚠️ ${result.message || '保存されました'} (${result.warning})`);
        } else {
          setMessage('✅ 保存されました！');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Save failed');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ 保存に失敗しました: ${errorMessage}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 5000); // Longer timeout for production warning
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ 画像がアップロードされました: ${result.filename}`);
        setTimeout(() => setMessage(''), 3000);
        return result.url;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessage(`❌ アップロードに失敗しました: ${errorMessage}`);
      setTimeout(() => setMessage(''), 3000);
      return null;
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800">コンテンツを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">コンテンツの読み込みに失敗しました</p>
        </div>
      </div>
    );
  }

  const currentContent = content?.[language];

  // Add safety check for currentContent
  if (!currentContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800">コンテンツを初期化中...</p>
        </div>
      </div>
    );
  }

  // Helper function to safely get nested values
  const safeGet = (obj: any, path: string, defaultValue: any = '') => {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    return result !== null && result !== undefined ? result : defaultValue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              FSG コンテンツ管理システム
            </h1>
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('jp')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === 'jp'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-800 hover:text-gray-900'
                  }`}
                >
                  日本語
                </button>
                <button
                  onClick={() => setLanguage('vn')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === 'vn'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-800 hover:text-gray-900'
                  }`}
                >
                  Tiếng Việt
                </button>
              </div>
              
              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
          
          {message && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-800">{message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ヒーローセクション</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'hero.title')}
                  onChange={(e) => updateContent('hero', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  サブタイトル
                </label>
                <textarea
                  rows={3}
                  value={safeGet(currentContent, 'hero.subtitle')}
                  onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">会社概要セクション</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  セクションタイトル
                </label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'about.title')}
                  onChange={(e) => updateContent('about', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  説明文
                </label>
                <textarea
                  rows={3}
                  value={safeGet(currentContent, 'about.subtitle')}
                  onChange={(e) => updateContent('about', 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              {/* FPT Company Slides */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">FPTソフトウェアジャパン 会社紹介スライド</h3>
                <div className="space-y-2">
                  {(currentContent.slides?.fpt || []).map((slide: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder={`スライド${index + 1}のパス`}
                        value={slide}
                        onChange={(e) => {
                          const newSlides = [...(currentContent.slides?.fpt || [])];
                          newSlides[index] = e.target.value;
                          updateContent('slides', 'fpt', newSlides);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded text-sm text-gray-900"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const uploadedUrl = await uploadImage(file);
                            if (uploadedUrl) {
                              const newSlides = [...(currentContent.slides?.fpt || [])];
                              newSlides[index] = uploadedUrl;
                              updateContent('slides', 'fpt', newSlides);
                              
                              // Auto-save content after successful upload
                              setTimeout(() => {
                                saveContent();
                              }, 100);
                            }
                          }
                          e.target.value = '';
                        }}
                        disabled={uploading}
                        className="hidden"
                        id={`upload-fpt-${index}`}
                      />
                      <label
                        htmlFor={`upload-fpt-${index}`}
                        className={`px-2 py-1 ${uploading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition-colors cursor-pointer text-xs`}
                      >
                        📷
                      </label>
                      <button
                        onClick={() => {
                          const newSlides = (currentContent.slides?.fpt || []).filter((_: string, i: number) => i !== index);
                          updateContent('slides', 'fpt', newSlides);
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const newSlides = [...(currentContent.slides?.fpt || []), '/slides/新しいスライド.jpg'];
                        updateContent('slides', 'fpt', newSlides);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                    >
                      追加
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const uploadedUrl = await uploadImage(file);
                          if (uploadedUrl) {
                            const newSlides = [...(currentContent.slides?.fpt || []), uploadedUrl];
                            updateContent('slides', 'fpt', newSlides);
                          }
                        }
                        e.target.value = '';
                      }}
                      disabled={uploading}
                      className="hidden"
                      id="upload-new-fpt"
                    />
                    <label
                      htmlFor="upload-new-fpt"
                      className={`px-3 py-1 ${uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded transition-colors cursor-pointer text-xs`}
                    >
                      📷 Upload
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ミッション</h3>
                  <input
                    type="text"
                    placeholder="タイトル"
                    value={safeGet(currentContent, 'about.mission.title')}
                    onChange={(e) => updateContent('about', 'mission', e.target.value, 'title')}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                  />
                  <textarea
                    rows={3}
                    placeholder="説明"
                    value={safeGet(currentContent, 'about.mission.desc')}
                    onChange={(e) => updateContent('about', 'mission', e.target.value, 'desc')}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ビジョン</h3>
                  <input
                    type="text"
                    placeholder="タイトル"
                    value={safeGet(currentContent, 'about.vision.title')}
                    onChange={(e) => updateContent('about', 'vision', e.target.value, 'title')}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                  />
                  <textarea
                    rows={3}
                    placeholder="説明"
                    value={safeGet(currentContent, 'about.vision.desc')}
                    onChange={(e) => updateContent('about', 'vision', e.target.value, 'desc')}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">バリュー</h3>
                  <input
                    type="text"
                    placeholder="タイトル"
                    value={safeGet(currentContent, 'about.values.title')}
                    onChange={(e) => updateContent('about', 'values', e.target.value, 'title')}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                  />
                  <textarea
                    rows={3}
                    placeholder="説明"
                    value={safeGet(currentContent, 'about.values.desc')}
                    onChange={(e) => updateContent('about', 'values', e.target.value, 'desc')}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">サービスセクション</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    セクションタイトル
                  </label>
                  <input
                    type="text"
                    value={currentContent.services.title}
                    onChange={(e) => updateContent('services', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    サブタイトル
                  </label>
                  <textarea
                    rows={2}
                    value={currentContent.services.subtitle}
                    onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {['finance', 'legacy', 'public', 'salesforce'].map((service) => (
                  <div key={service} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                      {service === 'finance' ? '金融' : 
                       service === 'legacy' ? 'レガシー' :
                       service === 'public' ? '公共' : 'Salesforce'}
                    </h3>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="サービス名"
                        value={currentContent.services[service].title}
                        onChange={(e) => updateContent('services', service, e.target.value, 'title')}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                      <textarea
                        rows={3}
                        placeholder="説明"
                        value={currentContent.services[service].desc}
                        onChange={(e) => updateContent('services', service, e.target.value, 'desc')}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                      <input
                        type="text"
                        placeholder="統計情報"
                        value={currentContent.services[service].stats}
                        onChange={(e) => updateContent('services', service, e.target.value, 'stats')}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                      
                      {/* Slides management for this service */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">スライド画像</h4>
                        <div className="space-y-2">
                          {(currentContent.slides?.[service] || []).map((slide: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder={`スライド${index + 1}のパス`}
                                value={slide}
                                onChange={(e) => {
                                  const newSlides = [...(currentContent.slides?.[service] || [])];
                                  newSlides[index] = e.target.value;
                                  updateContent('slides', service, newSlides);
                                }}
                                className="flex-1 p-2 border border-gray-300 rounded text-sm text-gray-900"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const uploadedUrl = await uploadImage(file);
                                    if (uploadedUrl) {
                                      const newSlides = [...(currentContent.slides?.[service] || [])];
                                      newSlides[index] = uploadedUrl;
                                      updateContent('slides', service, newSlides);
                                      
                                      // Auto-save content after successful upload
                                      setTimeout(() => {
                                        saveContent();
                                      }, 100);
                                    }
                                  }
                                  e.target.value = '';
                                }}
                                disabled={uploading}
                                className="hidden"
                                id={`upload-${service}-${index}`}
                              />
                              <label
                                htmlFor={`upload-${service}-${index}`}
                                className={`px-2 py-1 ${uploading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition-colors cursor-pointer text-xs`}
                              >
                                📷
                              </label>
                              <button
                                onClick={() => {
                                  const newSlides = (currentContent.slides?.[service] || []).filter((_: string, i: number) => i !== index);
                                  updateContent('slides', service, newSlides);
                                }}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-xs"
                              >
                                削除
                              </button>
                            </div>
                          ))}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const newSlides = [...(currentContent.slides?.[service] || []), '/slides/新しいスライド.jpg'];
                                updateContent('slides', service, newSlides);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                            >
                              追加
                            </button>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const uploadedUrl = await uploadImage(file);
                                  if (uploadedUrl) {
                                    const newSlides = [...(currentContent.slides?.[service] || []), uploadedUrl];
                                    updateContent('slides', service, newSlides);
                                  }
                                }
                                e.target.value = '';
                              }}
                              disabled={uploading}
                              className="hidden"
                              id={`upload-new-${service}`}
                            />
                            <label
                              htmlFor={`upload-new-${service}`}
                              className={`px-3 py-1 ${uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded transition-colors cursor-pointer text-xs`}
                            >
                              📷 Upload
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">主要実績セクション</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    セクションタイトル
                  </label>
                  <input
                    type="text"
                    value={currentContent.products.title}
                    onChange={(e) => updateContent('products', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    サブタイトル
                  </label>
                  <textarea
                    rows={2}
                    value={currentContent.products.subtitle}
                    onChange={(e) => updateContent('products', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {['finance', 'legacy', 'public', 'salesforce'].map((product) => (
                  <div key={product} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                      {product === 'finance' ? '金融実績' : 
                       product === 'legacy' ? 'レガシー実績' :
                       product === 'public' ? '公共実績' : 'Salesforce実績'}
                    </h3>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="実績名"
                        value={currentContent.products[product].name}
                        onChange={(e) => updateContent('products', product, e.target.value, 'name')}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                      <textarea
                        rows={2}
                        placeholder="説明"
                        value={currentContent.products[product].desc}
                        onChange={(e) => updateContent('products', product, e.target.value, 'desc')}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map((num) => (
                          <input
                            key={num}
                            type="text"
                            placeholder={`特徴${num}`}
                            value={currentContent.products[product][`feature${num}`]}
                            onChange={(e) => updateContent('products', product, e.target.value, `feature${num}`)}
                            className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">カスタムソリューション</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="タイトル"
                    value={currentContent.products.custom.title}
                    onChange={(e) => updateContent('products', 'custom', e.target.value, 'title')}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                  <textarea
                    rows={2}
                    placeholder="説明"
                    value={currentContent.products.custom.desc}
                    onChange={(e) => updateContent('products', 'custom', e.target.value, 'desc')}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Partners Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">パートナーセクション</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  セクションタイトル
                </label>
                <input
                  type="text"
                  value={currentContent.partners.title}
                  onChange={(e) => updateContent('partners', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  サブタイトル
                </label>
                <textarea
                  rows={2}
                  value={currentContent.partners.subtitle}
                  onChange={(e) => updateContent('partners', 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  追加パートナーテキスト
                </label>
                <input
                  type="text"
                  value={currentContent.partners.additional}
                  onChange={(e) => updateContent('partners', 'additional', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">お問い合わせセクション</h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    セクションタイトル
                  </label>
                  <input
                    type="text"
                    value={currentContent.contact.title}
                    onChange={(e) => updateContent('contact', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    サブタイトル
                  </label>
                  <textarea
                    rows={2}
                    value={currentContent.contact.subtitle}
                    onChange={(e) => updateContent('contact', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    営業時間（平日）
                  </label>
                  <input
                    type="text"
                    value={currentContent.contact.hours_weekday}
                    onChange={(e) => updateContent('contact', 'hours_weekday', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    営業時間（土曜）
                  </label>
                  <input
                    type="text"
                    value={currentContent.contact.hours_saturday}
                    onChange={(e) => updateContent('contact', 'hours_saturday', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    お問い合わせ情報タイトル
                  </label>
                  <input
                    type="text"
                    value={currentContent.contact.info.title}
                    onChange={(e) => updateContent('contact', 'info', e.target.value, 'title')}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">フォームラベル</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="お名前ラベル"
                      value={currentContent.contact.form.name}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'name')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="メールアドレスラベル"
                      value={currentContent.contact.form.email}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'email')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="電話番号ラベル"
                      value={currentContent.contact.form.phone}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'phone')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="会社名ラベル"
                      value={currentContent.contact.form.company}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'company')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">その他テキスト</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="メッセージラベル"
                      value={currentContent.contact.form.message}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'message')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="送信ボタンテキスト"
                      value={currentContent.contact.form.submit}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'submit')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="サービス選択テキスト"
                      value={currentContent.contact.form.select_service}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'select_service')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                    <input
                      type="text"
                      placeholder="その他オプション"
                      value={currentContent.contact.form.service_other}
                      onChange={(e) => updateContent('contact', 'form', e.target.value, 'service_other')}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">フッターセクション</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  会社説明
                </label>
                <textarea
                  rows={3}
                  value={currentContent.footer.description}
                  onChange={(e) => updateContent('footer', 'description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  会社名
                </label>
                <input
                  type="text"
                  value={currentContent.footer.company}
                  onChange={(e) => updateContent('footer', 'company', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  著作権表示
                </label>
                <input
                  type="text"
                  value={currentContent.footer.copyright}
                  onChange={(e) => updateContent('footer', 'copyright', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
