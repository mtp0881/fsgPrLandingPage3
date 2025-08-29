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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ヒーローセクション</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Main Content */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">メインコンテンツ（左側）</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    メインタイトル
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      詳細ボタンテキスト
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.explore')}
                      onChange={(e) => updateContent('hero', 'explore', e.target.value)}
                      placeholder="詳細を見る"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      デモボタンテキスト
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.demo')}
                      onChange={(e) => updateContent('hero', 'demo', e.target.value)}
                      placeholder="サービス紹介"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side - Visual Area */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">ビジュアルエリア（右側）</h3>
                
                {/* FSG Card */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">FSGカード</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        カードタイトル
                      </label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'hero.fsg_title')}
                        onChange={(e) => updateContent('hero', 'fsg_title', e.target.value)}
                        placeholder="FSG事業部"
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        カードサブタイトル
                      </label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'hero.fsg_subtitle')}
                        onChange={(e) => updateContent('hero', 'fsg_subtitle', e.target.value)}
                        placeholder="デジタル変革のエキスパート"
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                  </div>
                  
                  {/* Domain Tags */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      専門分野タグ
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <input
                          type="text"
                          value={safeGet(currentContent, 'hero.domains.finance')}
                          onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), finance: e.target.value })}
                          placeholder="金融"
                          className="w-full p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-green-50"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={safeGet(currentContent, 'hero.domains.public')}
                          onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), public: e.target.value })}
                          placeholder="公共"
                          className="w-full p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-red-50"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={safeGet(currentContent, 'hero.domains.legacy')}
                          onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), legacy: e.target.value })}
                          placeholder="レガシー"
                          className="w-full p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-purple-50"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={safeGet(currentContent, 'hero.domains.salesforce')}
                          onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), salesforce: e.target.value })}
                          placeholder="Salesforce"
                          className="w-full p-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-cyan-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">フローティング統計</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        アップタイム統計（左上）
                      </label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'hero.uptime')}
                        onChange={(e) => updateContent('hero', 'uptime', e.target.value)}
                        placeholder="500+ 金融エンジニア"
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        サポート情報（右下）
                      </label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'hero.support')}
                        onChange={(e) => updateContent('hero', 'support', e.target.value)}
                        placeholder="15拠点 全国対応"
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      />
                    </div>
                  </div>
                </div>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">パートナーセクション</h2>
            
            {/* Basic Content */}
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  セクションタイトル
                </label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'partners.title')}
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
                  value={safeGet(currentContent, 'partners.subtitle')}
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
                  value={safeGet(currentContent, 'partners.additional')}
                  onChange={(e) => updateContent('partners', 'additional', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>

            {/* Main Partners */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">メインパートナー（固定3つ - 大きく表示）</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {Array.from({ length: 3 }, (_, index) => {
                  const currentPartners = safeGet(currentContent, 'partners.main_partners', []) || [];
                  const partner = currentPartners[index] || { 
                    name: '', 
                    logo: index === 0 ? '/partners/ntt-data--600.png' : 
                          index === 1 ? '/partners/596797.png' : 
                          '/partners/fujitsu.webp', 
                    width: 200, 
                    height: 100 
                  };
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded p-2 hover:border-blue-300 transition-all duration-300 shadow-sm">
                      <div className="space-y-1.5">
                        {/* Partner Index */}
                        <div className="text-center">
                          <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        </div>

                        {/* Current URL Display */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            URL:
                          </label>
                          <div className="p-1.5 bg-gray-50 border border-gray-300 rounded text-xs text-gray-600 break-all min-h-[30px] flex items-center">
                            {partner.logo || '(なし)'}
                          </div>
                        </div>

                        {/* Upload Button */}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const uploadedUrl = await uploadImage(file);
                                if (uploadedUrl) {
                                  const updatedPartners = [...(safeGet(currentContent, 'partners.main_partners', []) || [])];
                                  while (updatedPartners.length <= index) {
                                    updatedPartners.push({ name: '', logo: '', width: 200, height: 100 });
                                  }
                                  updatedPartners[index] = { ...partner, logo: uploadedUrl };
                                  updateContent('partners', 'main_partners', updatedPartners);
                                  
                                  // Auto-save
                                  setTimeout(() => {
                                    saveContent();
                                  }, 100);
                                }
                              }
                              e.target.value = '';
                            }}
                            disabled={uploading}
                            className="hidden"
                            id={`upload-main-partner-${index}`}
                          />
                          <label
                            htmlFor={`upload-main-partner-${index}`}
                            className={`w-full block px-2 py-1 ${uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors cursor-pointer text-xs text-center font-medium`}
                          >
                            {uploading ? 'UP中...' : '📷 変更'}
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Secondary Partners */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">セカンダリパートナー（固定5つ - 小さく表示）</h3>
              <div className="grid md:grid-cols-5 gap-2">
                {Array.from({ length: 5 }, (_, index) => {
                  const currentPartners = safeGet(currentContent, 'partners.secondary_partners', []) || [];
                  const defaultLogos = [
                    '/partners/deutsche-bank.webp',
                    '/partners/closing exchange.webp', 
                    '/partners/docmagic.webp',
                    '/partners/symphony.webp',
                    '/partners/item_lv2.webp'
                  ];
                  const partner = currentPartners[index] || { 
                    name: '', 
                    logo: defaultLogos[index] || '', 
                    width: 120, 
                    height: 60 
                  };
                  
                  return (
                    <div key={index} className="bg-white border border-gray-200 rounded p-1.5 hover:border-blue-300 transition-all duration-300 shadow-sm">
                      <div className="space-y-1">
                        {/* Partner Index */}
                        <div className="text-center">
                          <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        </div>

                        {/* Current URL Display */}
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">
                            URL:
                          </label>
                          <div className="p-1 bg-gray-50 border border-gray-300 rounded text-xs text-gray-600 break-all min-h-[24px] flex items-center">
                            {partner.logo || '(なし)'}
                          </div>
                        </div>

                        {/* Upload Button */}
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const uploadedUrl = await uploadImage(file);
                                if (uploadedUrl) {
                                  const updatedPartners = [...(safeGet(currentContent, 'partners.secondary_partners', []) || [])];
                                  while (updatedPartners.length <= index) {
                                    updatedPartners.push({ name: '', logo: '', width: 120, height: 60 });
                                  }
                                  updatedPartners[index] = { ...partner, logo: uploadedUrl };
                                  updateContent('partners', 'secondary_partners', updatedPartners);
                                  
                                  // Auto-save
                                  setTimeout(() => {
                                    saveContent();
                                  }, 100);
                                }
                              }
                              e.target.value = '';
                            }}
                            disabled={uploading}
                            className="hidden"
                            id={`upload-secondary-partner-${index}`}
                          />
                          <label
                            htmlFor={`upload-secondary-partner-${index}`}
                            className={`w-full block px-1 py-0.5 ${uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded transition-colors cursor-pointer text-xs text-center font-medium`}
                          >
                            {uploading ? 'UP中...' : '📷 変更'}
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Global Network Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">グローバルネットワークセクション</h2>
            
            {/* Basic Content */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  セクションタイトル
                </label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'global_network.title')}
                  onChange={(e) => updateContent('global_network', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  サブタイトル
                </label>
                <textarea
                  rows={2}
                  value={safeGet(currentContent, 'global_network.subtitle')}
                  onChange={(e) => updateContent('global_network', 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">統計データ</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    日本国内拠点数
                  </label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'global_network.stats.japan_offices')}
                    onChange={(e) => updateContent('global_network', 'stats', { ...safeGet(currentContent, 'global_network.stats', {}), japan_offices: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    placeholder="23"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    国・地域数
                  </label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'global_network.stats.countries')}
                    onChange={(e) => updateContent('global_network', 'stats', { ...safeGet(currentContent, 'global_network.stats', {}), countries: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    総オフィス数
                  </label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'global_network.stats.total_offices')}
                    onChange={(e) => updateContent('global_network', 'stats', { ...safeGet(currentContent, 'global_network.stats', {}), total_offices: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    placeholder="86"
                  />
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">グローバル能力</h3>
              <div className="grid md:grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      AI研究者ラベル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.ai_researchers.label')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        ai_researchers: { 
                          ...safeGet(currentContent, 'global_network.capabilities.ai_researchers', {}), 
                          label: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="AI研究者"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      AI研究者数値
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.ai_researchers.value')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        ai_researchers: { 
                          ...safeGet(currentContent, 'global_network.capabilities.ai_researchers', {}), 
                          value: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="20K+"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      金融エンジニアラベル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.finance_engineers.label')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        finance_engineers: { 
                          ...safeGet(currentContent, 'global_network.capabilities.finance_engineers', {}), 
                          label: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="金融エンジニア"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      金融エンジニア数値
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.finance_engineers.value')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        finance_engineers: { 
                          ...safeGet(currentContent, 'global_network.capabilities.finance_engineers', {}), 
                          value: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="500+"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Salesforce専門家ラベル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.salesforce_experts.label')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        salesforce_experts: { 
                          ...safeGet(currentContent, 'global_network.capabilities.salesforce_experts', {}), 
                          label: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="Salesforce専門家"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Salesforce専門家数値
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.salesforce_experts.value')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        salesforce_experts: { 
                          ...safeGet(currentContent, 'global_network.capabilities.salesforce_experts', {}), 
                          value: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="200+"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      開発センターラベル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.dev_centers.label')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        dev_centers: { 
                          ...safeGet(currentContent, 'global_network.capabilities.dev_centers', {}), 
                          label: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="開発センター"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      開発センター数値
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.dev_centers.value')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        dev_centers: { 
                          ...safeGet(currentContent, 'global_network.capabilities.dev_centers', {}), 
                          value: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="18+"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      AIパートナーラベル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.ai_partners.label')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        ai_partners: { 
                          ...safeGet(currentContent, 'global_network.capabilities.ai_partners', {}), 
                          label: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="AIパートナー"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      AIパートナー数値
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.capabilities.ai_partners.value')}
                      onChange={(e) => updateContent('global_network', 'capabilities', { 
                        ...safeGet(currentContent, 'global_network.capabilities', {}), 
                        ai_partners: { 
                          ...safeGet(currentContent, 'global_network.capabilities.ai_partners', {}), 
                          value: e.target.value 
                        } 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                      placeholder="5+"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">特長セクション</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      クイニョンAIセンター - タイトル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.quy_nhon_ai.title')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        quy_nhon_ai: { ...safeGet(currentContent, 'global_network.features.quy_nhon_ai', {}), title: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      クイニョンAIセンター - 説明
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.quy_nhon_ai.description')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        quy_nhon_ai: { ...safeGet(currentContent, 'global_network.features.quy_nhon_ai', {}), description: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AIパートナーシップ - タイトル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.ai_partnerships.title')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        ai_partnerships: { ...safeGet(currentContent, 'global_network.features.ai_partnerships', {}), title: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AIパートナーシップ - 説明
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.ai_partnerships.description')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        ai_partnerships: { ...safeGet(currentContent, 'global_network.features.ai_partnerships', {}), description: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      グローバル展開 - タイトル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.global_deployment.title')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        global_deployment: { ...safeGet(currentContent, 'global_network.features.global_deployment', {}), title: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      グローバル展開 - 説明
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.global_deployment.description')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        global_deployment: { ...safeGet(currentContent, 'global_network.features.global_deployment', {}), description: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      国際品質基準 - タイトル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.quality_standards.title')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        quality_standards: { ...safeGet(currentContent, 'global_network.features.quality_standards', {}), title: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      国際品質基準 - 説明
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.features.quality_standards.description')}
                      onChange={(e) => updateContent('global_network', 'features', { 
                        ...safeGet(currentContent, 'global_network.features', {}), 
                        quality_standards: { ...safeGet(currentContent, 'global_network.features.quality_standards', {}), description: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-sm text-gray-900"
                    />
                  </div>
                </div>
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
                  タイトル
                </label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'footer.title')}
                  onChange={(e) => updateContent('footer', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="FSG事業部"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  会社説明
                </label>
                <textarea
                  rows={3}
                  value={safeGet(currentContent, 'footer.description')}
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
                  value={safeGet(currentContent, 'footer.company')}
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
                  value={safeGet(currentContent, 'footer.copyright')}
                  onChange={(e) => updateContent('footer', 'copyright', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              
              {/* Business Domains Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">事業ドメイン</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      セクションタイトル
                    </label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'footer.business_domains.title')}
                      onChange={(e) => updateContent('footer', 'business_domains', { 
                        ...safeGet(currentContent, 'footer.business_domains', {}), 
                        title: e.target.value 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      placeholder="事業ドメイン"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">金融サービス</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'footer.business_domains.links.finance')}
                        onChange={(e) => updateContent('footer', 'business_domains', { 
                          ...safeGet(currentContent, 'footer.business_domains', {}), 
                          links: { 
                            ...safeGet(currentContent, 'footer.business_domains.links', {}), 
                            finance: e.target.value 
                          } 
                        })}
                        className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                        placeholder="金融サービス"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">レガシーモダナイゼーション</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'footer.business_domains.links.legacy')}
                        onChange={(e) => updateContent('footer', 'business_domains', { 
                          ...safeGet(currentContent, 'footer.business_domains', {}), 
                          links: { 
                            ...safeGet(currentContent, 'footer.business_domains.links', {}), 
                            legacy: e.target.value 
                          } 
                        })}
                        className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                        placeholder="レガシーモダナイゼーション"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">公共サービス</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'footer.business_domains.links.public')}
                        onChange={(e) => updateContent('footer', 'business_domains', { 
                          ...safeGet(currentContent, 'footer.business_domains', {}), 
                          links: { 
                            ...safeGet(currentContent, 'footer.business_domains.links', {}), 
                            public: e.target.value 
                          } 
                        })}
                        className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                        placeholder="公共サービス"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Salesforceソリューション</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'footer.business_domains.links.salesforce')}
                        onChange={(e) => updateContent('footer', 'business_domains', { 
                          ...safeGet(currentContent, 'footer.business_domains', {}), 
                          links: { 
                            ...safeGet(currentContent, 'footer.business_domains.links', {}), 
                            salesforce: e.target.value 
                          } 
                        })}
                        className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                        placeholder="Salesforceソリューション"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">ソーシャルリンク</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={safeGet(currentContent, 'footer.social_links.linkedin')}
                      onChange={(e) => updateContent('footer', 'social_links', { 
                        ...safeGet(currentContent, 'footer.social_links', {}), 
                        linkedin: e.target.value 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      placeholder="https://jp.linkedin.com/company/fptjapanholdings"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={safeGet(currentContent, 'footer.social_links.website')}
                      onChange={(e) => updateContent('footer', 'social_links', { 
                        ...safeGet(currentContent, 'footer.social_links', {}), 
                        website: e.target.value 
                      })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      placeholder="https://fptsoftware.jp/about-us/fpt-japan"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
