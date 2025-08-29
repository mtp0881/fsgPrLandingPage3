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
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(loginTime);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (timeDiff < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminLoggedIn');
          localStorage.removeItem('adminLoginTime');
        }
      }
    };
    
    checkAuth();
  }, []);

  // Load content on mount
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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Safe get function
  const safeGet = (obj: any, path: string, defaultValue: any = '') => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };

  const updateContent = (section: string, field: string, value: string | any[], subField?: string) => {
    if (!content) return;
    
    setContent(prev => {
      if (!prev) return prev;
      
      const newContent = { ...prev };
      
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
        setMessage('✅ 保存に成功しました');
      } else {
        setMessage('❌ 保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('❌ 保存に失敗しました');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Upload image function
  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        return data.url;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('❌ 画像のアップロードに失敗しました');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">コンテンツの読み込みに失敗しました</p>
        </div>
      </div>
    );
  }

  const currentContent = content[language];

  return (
  <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}

      <header className="bg-white shadow-sm border-b fixed top-0 left-0 w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">FSGコンテンツ編集パネル</h1>
            </div>
            {message && (
              <div className="flex-1 flex justify-center px-4">
                <div className="bg-white border border-gray-200 text-gray-800 px-4 py-1.5 rounded-full shadow-md text-sm font-medium flex items-center gap-2 opacity-0 animate-[fadeInOut_3s_ease-in-out_forwards]">
                  <span className="text-green-500">✅</span>
                  <span>{message.replace('✅ ', '').replace('❌ ', '')}</span>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4">
              {/* Language Switcher - Switchbox style */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1 w-[100px] shrink-0">
                <button
                  onClick={() => setLanguage('jp')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 text-center ${
                    language === 'jp'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  JP
                </button>
                <button
                  onClick={() => setLanguage('vn')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 text-center ${
                    language === 'vn'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  VN
                </button>
              </div>
              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                保存
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="space-y-8">
          {/* 1. ヒーローセクション - Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-blue-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">1</span>
                <h2 className="text-lg font-semibold text-gray-900">🏠 ヒーローセクション</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
              {/* Left Content */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">メインコンテンツ</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">メインタイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'hero.title')}
                    onChange={(e) => updateContent('hero', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="FSG事業部 デジタル変革のパートナー"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
                  <textarea
                    rows={3}
                    value={safeGet(currentContent, 'hero.subtitle')}
                    onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">探索ボタン</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.explore')}
                      onChange={(e) => updateContent('hero', 'explore', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">デモボタン</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.demo')}
                      onChange={(e) => updateContent('hero', 'demo', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Right Content - FSG Card */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2">FSGカード</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FSGタイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'hero.fsg_title')}
                    onChange={(e) => updateContent('hero', 'fsg_title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">FSGサブタイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'hero.fsg_subtitle')}
                    onChange={(e) => updateContent('hero', 'fsg_subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">金融</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.domains.finance')}
                      onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), finance: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">公共</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.domains.public')}
                      onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), public: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">レガシー</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.domains.legacy')}
                      onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), legacy: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Salesforce</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'hero.domains.salesforce')}
                      onChange={(e) => updateContent('hero', 'domains', { ...safeGet(currentContent, 'hero.domains', {}), salesforce: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* 2. Aboutセクション - About Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-green-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">2</span>
                <h2 className="text-lg font-semibold text-gray-900">📖 Aboutセクション</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'about.title')}
                  onChange={(e) => updateContent('about', 'title', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
                <textarea
                  rows={3}
                  value={safeGet(currentContent, 'about.subtitle')}
                  onChange={(e) => updateContent('about', 'subtitle', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              {/* FPT Slides Management */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">FPTスライド画像管理</h3>
                
                {/* File format notice */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">ℹ️</span>
                    <span className="text-sm text-yellow-800 font-medium">JPG, JPEG, PNG, GIF のみアップロード可能です。最大ファイルサイズ: 5MB</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">FPT スライド</h4>
                    <span className="text-xs text-gray-500">
                      {Array.isArray(safeGet(currentContent, 'slides.fpt')) ? safeGet(currentContent, 'slides.fpt').length : 0} 枚
                    </span>
                  </div>
                  
                  {/* Existing Slides */}
                  <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                    {safeGet(currentContent, 'slides.fpt', []).map((slide: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                        {/* Move Controls */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => {
                              if (index > 0) {
                                const currentSlides = safeGet(currentContent, 'slides.fpt', []);
                                const newSlides = [...currentSlides];
                                [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
                                updateContent('slides', 'fpt', newSlides);
                                setMessage('✅ スライドの順序を変更しました');
                              }
                            }}
                            disabled={index === 0}
                            className={`px-2 py-1 text-xs border rounded transition-colors ${
                              index === 0 
                                ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50 border-blue-300'
                            }`}
                            title="上に移動"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => {
                              const currentSlides = safeGet(currentContent, 'slides.fpt', []);
                              if (index < currentSlides.length - 1) {
                                const newSlides = [...currentSlides];
                                [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
                                updateContent('slides', 'fpt', newSlides);
                                setMessage('✅ スライドの順序を変更しました');
                              }
                            }}
                            disabled={index === safeGet(currentContent, 'slides.fpt', []).length - 1}
                            className={`px-2 py-1 text-xs border rounded transition-colors ${
                              index === safeGet(currentContent, 'slides.fpt', []).length - 1
                                ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                                : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50 border-blue-300'
                            }`}
                            title="下に移動"
                          >
                            ↓
                          </button>
                        </div>
                        
                        {/* Slide Preview */}
                        <div className="flex-shrink-0">
                          <img src={slide} alt={`FPT slide ${index + 1}`} className="w-16 h-10 object-cover rounded border" />
                        </div>
                        
                        {/* Slide Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-700">
                            FPTスライド {index + 1}
                          </div>
                          <div className="text-xs text-gray-500 truncate" title={slide}>
                            {slide}
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <div>
                          <button
                            onClick={() => {
                              if (confirm('このスライドを削除しますか？')) {
                                const currentSlides = safeGet(currentContent, 'slides.fpt', []);
                                const newSlides = currentSlides.filter((_: any, i: number) => i !== index);
                                updateContent('slides', 'fpt', newSlides);
                                setMessage('✅ スライドが削除されました');
                              }
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 text-sm border border-red-300 rounded-lg transition-colors"
                            title="削除"
                          >
                            🗑️ 削除
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!safeGet(currentContent, 'slides.fpt', []).length) && (
                      <div className="text-center py-6 text-gray-500">
                        <div className="text-lg mb-2">📄</div>
                        <div className="text-sm">FPTスライドがまだありません</div>
                        <div className="text-xs text-gray-400">下記のボタンから追加してください</div>
                      </div>
                    )}
                  </div>

                  {/* Add New Slide */}
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          uploadImage(e.target.files[0]).then((url: string) => {
                            const currentSlides = Array.isArray(safeGet(currentContent, 'slides.fpt')) ? safeGet(currentContent, 'slides.fpt') : [];
                            updateContent('slides', 'fpt', [...currentSlides, url]);
                            setMessage('✅ FPTスライドが追加されました');
                          }).catch(() => {
                            setMessage('❌ スライドの追加に失敗しました');
                          });
                        }
                      }}
                      className="hidden"
                      disabled={uploading}
                      id="fpt-slide-upload"
                    />
                    <label
                      htmlFor="fpt-slide-upload"
                      className={`inline-block px-6 py-3 bg-green-500 text-white rounded-lg cursor-pointer hover:bg-green-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? '📤 アップロード中...' : '🖼️ 画像追加'}
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">ミッション</h3>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'about.mission.title')}
                    onChange={(e) => updateContent('about', 'mission', { ...safeGet(currentContent, 'about.mission', {}), title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                    placeholder="ミッション"
                  />
                  <textarea
                    rows={3}
                    value={safeGet(currentContent, 'about.mission.desc')}
                    onChange={(e) => updateContent('about', 'mission', { ...safeGet(currentContent, 'about.mission', {}), desc: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">ビジョン</h3>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'about.vision.title')}
                    onChange={(e) => updateContent('about', 'vision', { ...safeGet(currentContent, 'about.vision', {}), title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                    placeholder="ビジョン"
                  />
                  <textarea
                    rows={3}
                    value={safeGet(currentContent, 'about.vision.desc')}
                    onChange={(e) => updateContent('about', 'vision', { ...safeGet(currentContent, 'about.vision', {}), desc: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-2">バリュー</h3>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'about.values.title')}
                    onChange={(e) => updateContent('about', 'values', { ...safeGet(currentContent, 'about.values', {}), title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mb-2 text-gray-900"
                    placeholder="バリュー"
                  />
                  <textarea
                    rows={3}
                    value={safeGet(currentContent, 'about.values.desc')}
                    onChange={(e) => updateContent('about', 'values', { ...safeGet(currentContent, 'about.values', {}), desc: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Services Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-purple-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">3</span>
                <h2 className="text-lg font-semibold text-gray-900">🔧 サービスセクション</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">セクションタイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'services.title')}
                    onChange={(e) => updateContent('services', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
                  <textarea
                    rows={2}
                    value={safeGet(currentContent, 'services.subtitle')}
                    onChange={(e) => updateContent('services', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {['finance', 'legacy', 'public', 'salesforce'].map((service) => (
                  <div key={service} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3 capitalize">{service}</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={safeGet(currentContent, `services.${service}.title`)}
                        onChange={(e) => updateContent('services', service, { ...safeGet(currentContent, `services.${service}`, {}), title: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="タイトル"
                      />
                      <textarea
                        rows={2}
                        value={safeGet(currentContent, `services.${service}.desc`)}
                        onChange={(e) => updateContent('services', service, { ...safeGet(currentContent, `services.${service}`, {}), desc: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="説明"
                      />
                      <input
                        type="text"
                        value={safeGet(currentContent, `services.${service}.stats`)}
                        onChange={(e) => updateContent('services', service, { ...safeGet(currentContent, `services.${service}`, {}), stats: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="統計情報"
                      />
                      
                      {/* Slide Management for this service */}
                      <div className="bg-gray-50 rounded p-3 mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-medium text-gray-700">スライド画像</h5>
                          <span className="text-xs text-gray-500">
                            {Array.isArray(safeGet(currentContent, `slides.${service}`)) ? safeGet(currentContent, `slides.${service}`).length : 0} 枚
                          </span>
                        </div>
                        
                        {/* File format notice for services */}
                        <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-600 text-xs">ℹ️</span>
                            <span className="text-xs text-yellow-800 font-medium">JPG/PNG/GIF のみ (最大5MB)</span>
                          </div>
                        </div>
                        
                        {/* Existing Slides */}
                        <div className="space-y-1 max-h-32 overflow-y-auto mb-2">
                          {Array.isArray(safeGet(currentContent, `slides.${service}`)) && safeGet(currentContent, `slides.${service}`).map((slide: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-1 bg-white rounded border">
                              {/* Move Controls */}
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => {
                                    if (index > 0) {
                                      const currentSlides = safeGet(currentContent, `slides.${service}`, []);
                                      const newSlides = [...currentSlides];
                                      [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
                                      updateContent('slides', service, newSlides);
                                      setMessage(`✅ スライド位置が変更されました`);
                                    }
                                  }}
                                  disabled={index === 0}
                                  className={`px-1 py-0.5 text-xs rounded ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
                                  title="上へ"
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => {
                                    const currentSlides = safeGet(currentContent, `slides.${service}`, []);
                                    if (index < currentSlides.length - 1) {
                                      const newSlides = [...currentSlides];
                                      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
                                      updateContent('slides', service, newSlides);
                                      setMessage(`✅ スライド位置が変更されました`);
                                    }
                                  }}
                                  disabled={index === (Array.isArray(safeGet(currentContent, `slides.${service}`)) ? safeGet(currentContent, `slides.${service}`).length - 1 : 0)}
                                  className={`px-1 py-0.5 text-xs rounded ${index === (Array.isArray(safeGet(currentContent, `slides.${service}`)) ? safeGet(currentContent, `slides.${service}`).length - 1 : 0) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
                                  title="下へ"
                                >
                                  ↓
                                </button>
                              </div>
                              
                              {/* Slide Preview */}
                              <div className="flex-shrink-0">
                                <img src={slide} alt={`${service} slide ${index + 1}`} className="w-8 h-5 object-cover rounded border" />
                              </div>
                              
                              {/* Slide Info */}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-700">#{index + 1}</div>
                              </div>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  if (confirm(`スライド#${index + 1}を削除しますか？`)) {
                                    const currentSlides = safeGet(currentContent, `slides.${service}`, []);
                                    const newSlides = currentSlides.filter((_: any, i: number) => i !== index);
                                    updateContent('slides', service, newSlides);
                                    setMessage(`✅ スライドが削除されました`);
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 px-1 py-1 text-xs rounded"
                                title="削除"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                          {(!Array.isArray(safeGet(currentContent, `slides.${service}`)) || safeGet(currentContent, `slides.${service}`).length === 0) && (
                            <div className="text-center py-2 text-gray-500">
                              <div className="text-xs">スライドなし</div>
                            </div>
                          )}
                        </div>

                        {/* Add New Slide */}
                        <div className="text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                uploadImage(e.target.files[0]).then((url: string) => {
                                  const currentSlides = Array.isArray(safeGet(currentContent, `slides.${service}`)) ? safeGet(currentContent, `slides.${service}`) : [];
                                  updateContent('slides', service, [...currentSlides, url]);
                                  setMessage(`✅ スライドが追加されました`);
                                }).catch(() => {
                                  setMessage(`❌ スライドの追加に失敗しました`);
                                });
                              }
                            }}
                            className="hidden"
                            disabled={uploading}
                            id={`${service}-slide-upload`}
                          />
                          <label
                            htmlFor={`${service}-slide-upload`}
                            className={`inline-block px-3 py-1 bg-green-500 text-white text-xs font-medium rounded cursor-pointer hover:bg-green-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {uploading ? '📤 アップロード中...' : '🖼️ 追加'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3.5. Products Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-indigo-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold">3.5</span>
                <h2 className="text-lg font-semibold text-gray-900">🏆 実績セクション</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">セクションタイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'products.title')}
                    onChange={(e) => updateContent('products', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
                  <textarea
                    rows={2}
                    value={safeGet(currentContent, 'products.subtitle')}
                    onChange={(e) => updateContent('products', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {['finance', 'legacy', 'public', 'salesforce'].map((product) => (
                  <div key={product} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-3 capitalize">{product}</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={safeGet(currentContent, `products.${product}.name`)}
                        onChange={(e) => updateContent('products', product, { ...safeGet(currentContent, `products.${product}`, {}), name: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="製品名"
                      />
                      <textarea
                        rows={2}
                        value={safeGet(currentContent, `products.${product}.desc`)}
                        onChange={(e) => updateContent('products', product, { ...safeGet(currentContent, `products.${product}`, {}), desc: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                        placeholder="説明"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map(num => (
                          <input
                            key={num}
                            type="text"
                            value={safeGet(currentContent, `products.${product}.feature${num}`)}
                            onChange={(e) => updateContent('products', product, { ...safeGet(currentContent, `products.${product}`, {}), [`feature${num}`]: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                            placeholder={`機能${num}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">カスタムソリューション</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'products.custom.title')}
                      onChange={(e) => updateContent('products', 'custom', { ...safeGet(currentContent, 'products.custom', {}), title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'products.custom.desc')}
                      onChange={(e) => updateContent('products', 'custom', { ...safeGet(currentContent, 'products.custom', {}), desc: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">実績ラベル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'products.main_achievements')}
                    onChange={(e) => updateContent('products', 'main_achievements', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Partners Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-orange-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">4</span>
                <h2 className="text-lg font-semibold text-gray-900">🤝 パートナーセクション</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'partners.title')}
                    onChange={(e) => updateContent('partners', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'partners.subtitle')}
                    onChange={(e) => updateContent('partners', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">追加情報</label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'partners.additional')}
                  onChange={(e) => updateContent('partners', 'additional', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  メインパートナー画像 
                  <span className="text-sm text-gray-600 ml-2">
                    ({safeGet(currentContent, 'partners.main_partners', []).filter((p: any) => p && p.logo).length}/3)
                  </span>
                </h3>
                
                {/* File format notice */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">ℹ️</span>
                    <span className="text-sm text-yellow-800 font-medium">JPG, JPEG, PNG, GIF のみアップロード可能です。最大ファイルサイズ: 5MB</span>
                  </div>
                </div>
                
                {/* Main Partners Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[0, 1, 2].map((index) => {
                    const partner = safeGet(currentContent, `partners.main_partners.${index}`);
                    
                    return (
                      <div key={index} className="bg-white border rounded-lg p-4 text-center">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-700">#{index + 1}</h4>
                          {/* Current Image Preview */}
                          {partner && partner.logo && (
                            <div className="mt-2 mb-3">
                              <img 
                                src={partner.logo} 
                                alt={`Partner ${index + 1}`}
                                className="w-full h-20 object-contain bg-gray-50 rounded border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-1 truncate" title={partner.logo}>
                                {partner.logo}
                              </p>
                            </div>
                          )}
                          {(!partner || !partner.logo) && (
                            <div className="mt-2 mb-3 w-full h-20 bg-gray-100 rounded border flex items-center justify-center">
                              <span className="text-gray-400 text-xs">画像なし</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Change Button */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              uploadImage(e.target.files[0]).then((url: string) => {
                                const currentPartners = safeGet(currentContent, 'partners.main_partners', []);
                                const newPartners = [...currentPartners];
                                if (!newPartners[index]) newPartners[index] = {};
                                newPartners[index] = { 
                                  ...newPartners[index], 
                                  logo: url,
                                  width: 200,
                                  height: 100
                                };
                                updateContent('partners', 'main_partners', newPartners);
                                setMessage(`✅ パートナー#${index + 1}が更新されました`);
                              }).catch(() => {
                                setMessage('❌ パートナーの更新に失敗しました');
                              });
                            }
                          }}
                          className="hidden"
                          disabled={uploading}
                          id={`main-partner-${index}-upload`}
                        />
                        <label
                          htmlFor={`main-partner-${index}-upload`}
                          className={`block w-full px-3 py-2 bg-orange-500 text-white text-xs font-medium rounded cursor-pointer hover:bg-orange-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading ? '📤 更新中...' : '変更'}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  セカンダリパートナー画像
                  <span className="text-sm text-gray-600 ml-2">
                    ({safeGet(currentContent, 'partners.secondary_partners', []).filter((p: any) => p && p.logo).length}/5)
                  </span>
                </h3>
                
                {/* File format notice */}
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-600">ℹ️</span>
                    <span className="text-sm text-yellow-800 font-medium">JPG, JPEG, PNG, GIF のみアップロード可能です。最大ファイルサイズ: 5MB</span>
                  </div>
                </div>
                
                {/* Secondary Partners Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[0, 1, 2, 3, 4].map((index) => {
                    const partner = safeGet(currentContent, `partners.secondary_partners.${index}`);
                    
                    return (
                      <div key={index} className="bg-white border rounded-lg p-3 text-center">
                        <div className="mb-2">
                          <h4 className="text-xs font-medium text-gray-700">#{index + 1}</h4>
                          {/* Current Image Preview */}
                          {partner && partner.logo && (
                            <div className="mt-2 mb-2">
                              <img 
                                src={partner.logo} 
                                alt={`Secondary Partner ${index + 1}`}
                                className="w-full h-12 object-contain bg-gray-50 rounded border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-1 truncate" title={partner.logo}>
                                {partner.logo.split('/').pop()?.substring(0, 15)}...
                              </p>
                            </div>
                          )}
                          {(!partner || !partner.logo) && (
                            <div className="mt-2 mb-2 w-full h-12 bg-gray-100 rounded border flex items-center justify-center">
                              <span className="text-gray-400 text-xs">画像なし</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Change Button */}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              uploadImage(e.target.files[0]).then((url: string) => {
                                const currentPartners = safeGet(currentContent, 'partners.secondary_partners', []);
                                const newPartners = [...currentPartners];
                                if (!newPartners[index]) newPartners[index] = {};
                                newPartners[index] = { 
                                  ...newPartners[index], 
                                  logo: url,
                                  width: 120,
                                  height: 60
                                };
                                updateContent('partners', 'secondary_partners', newPartners);
                                setMessage(`✅ パートナー#${index + 1}が更新されました`);
                              }).catch(() => {
                                setMessage('❌ パートナーの更新に失敗しました');
                              });
                            }
                          }}
                          className="hidden"
                          disabled={uploading}
                          id={`secondary-partner-${index}-upload`}
                        />
                        <label
                          htmlFor={`secondary-partner-${index}-upload`}
                          className={`block w-full px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded cursor-pointer hover:bg-orange-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading ? '更新中...' : '変更'}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 5. Global Network Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-cyan-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold">5</span>
                <h2 className="text-lg font-semibold text-gray-900">🌐 グローバルネットワークセクション</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Global Presence Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">グローバル展開統計</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">日本国内拠点</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.stats.japan_offices')}
                      onChange={(e) => updateContent('global_network', 'stats', { ...safeGet(currentContent, 'global_network.stats', {}), japan_offices: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="23"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">国・地域</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.stats.countries')}
                      onChange={(e) => updateContent('global_network', 'stats', { ...safeGet(currentContent, 'global_network.stats', {}), countries: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">総オフィス数</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'global_network.stats.total_offices')}
                      onChange={(e) => updateContent('global_network', 'stats', { ...safeGet(currentContent, 'global_network.stats', {}), total_offices: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                      placeholder="86"
                    />
                  </div>
                </div>
              </div>

              {/* Global Capabilities */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">グローバル能力</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { key: 'ai_researchers', defaultLabel: 'AI研究者', defaultValue: '20K+' },
                    { key: 'finance_engineers', defaultLabel: '金融エンジニア', defaultValue: '500+' },
                    { key: 'salesforce_experts', defaultLabel: 'Salesforce専門家', defaultValue: '200+' },
                    { key: 'dev_centers', defaultLabel: '開発センター', defaultValue: '18+' },
                    { key: 'ai_partners', defaultLabel: 'AIパートナー', defaultValue: '5+' }
                  ].map(({ key, defaultLabel, defaultValue }) => (
                    <div key={key} className="border border-gray-200 rounded p-3 bg-white">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">ラベル</label>
                          <input
                            type="text"
                            value={safeGet(currentContent, `global_network.capabilities.${key}.label`) || defaultLabel}
                            onChange={(e) => updateContent('global_network', 'capabilities', {
                              ...safeGet(currentContent, 'global_network.capabilities', {}),
                              [key]: { 
                                ...safeGet(currentContent, `global_network.capabilities.${key}`, {}),
                                label: e.target.value 
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                            placeholder={defaultLabel}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">値</label>
                          <input
                            type="text"
                            value={safeGet(currentContent, `global_network.capabilities.${key}.value`) || ''}
                            onChange={(e) => updateContent('global_network', 'capabilities', {
                              ...safeGet(currentContent, 'global_network.capabilities', {}),
                              [key]: { 
                                ...safeGet(currentContent, `global_network.capabilities.${key}`, {}),
                                label: safeGet(currentContent, `global_network.capabilities.${key}.label`) || defaultLabel,
                                value: e.target.value 
                              }
                            })}
                            className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                            placeholder={defaultValue}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Global Features */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">グローバル機能・特徴</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'quy_nhon_ai', label: '#1' },
                    { key: 'ai_partnerships', label: '#2' },
                    { key: 'global_deployment', label: '#3' },
                    { key: 'quality_standards', label: '#4' }
                  ].map(({ key, label }) => (
                    <div key={key} className="border border-gray-200 rounded p-3 bg-white">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={safeGet(currentContent, `global_network.features.${key}.title`) || ''}
                          onChange={(e) => updateContent('global_network', 'features', {
                            ...safeGet(currentContent, 'global_network.features', {}),
                            [key]: { 
                              ...safeGet(currentContent, `global_network.features.${key}`, {}),
                              title: e.target.value 
                            }
                          })}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          placeholder="タイトル"
                        />
                        <textarea
                          rows={2}
                          value={safeGet(currentContent, `global_network.features.${key}.description`) || ''}
                          onChange={(e) => updateContent('global_network', 'features', {
                            ...safeGet(currentContent, 'global_network.features', {}),
                            [key]: { 
                              ...safeGet(currentContent, `global_network.features.${key}`, {}),
                              description: e.target.value 
                            }
                          })}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          placeholder="説明文"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section - 6 */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-pink-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">6</span>
                <h2 className="text-lg font-semibold text-gray-900">📧 コンタクトセクション</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'contact.title')}
                    onChange={(e) => updateContent('contact', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="お問い合わせ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">サブタイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'contact.subtitle')}
                    onChange={(e) => updateContent('contact', 'subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                    placeholder="お気軽にお問い合わせください"
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">連絡先情報</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Address Info */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">住所ラベル</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'contact.address')}
                        onChange={(e) => updateContent('contact', 'address', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                        placeholder="オフィス住所"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">郵便番号・住所1</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'contact.address_line1')}
                        onChange={(e) => updateContent('contact', 'address_line1', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                        placeholder="〒105-0011 東京都港区芝公園1-7-6"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">住所2（建物名・階数）</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'contact.address_line2')}
                        onChange={(e) => updateContent('contact', 'address_line2', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                        placeholder="KDX浜松町プレイス6階（受付：5階）"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">電話番号ラベル</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'contact.phone')}
                        onChange={(e) => updateContent('contact', 'phone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                        placeholder="電話番号"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">TEL番号</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'contact.tel_number')}
                        onChange={(e) => updateContent('contact', 'tel_number', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                        placeholder="03-6634-6868"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">FAX番号</label>
                      <input
                        type="text"
                        value={safeGet(currentContent, 'contact.fax_number')}
                        onChange={(e) => updateContent('contact', 'fax_number', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                        placeholder="03-6634-6869"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">メールラベル</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'contact.email')}
                      onChange={(e) => updateContent('contact', 'email', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                      placeholder="メールアドレス"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">メールアドレス</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'contact.email_address')}
                      onChange={(e) => updateContent('contact', 'email_address', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                      placeholder="fsg@fpt-software.jp"
                    />
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">営業時間</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">営業時間ラベル</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'contact.hours')}
                      onChange={(e) => updateContent('contact', 'hours', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                      placeholder="営業時間"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">平日営業時間</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'contact.hours_weekday')}
                      onChange={(e) => updateContent('contact', 'hours_weekday', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                      placeholder="平日 9:00-18:00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">土曜営業時間</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'contact.hours_saturday')}
                      onChange={(e) => updateContent('contact', 'hours_saturday', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900 text-sm"
                      placeholder="土曜 9:00-17:00"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Footer Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">7</span>
                <h2 className="text-lg font-semibold text-gray-900">🏢 フッターセクション</h2>
              </div>
              <span className="text-sm text-gray-600">会社情報・リンク・コピーライト</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'footer.title')}
                    onChange={(e) => updateContent('footer', 'title', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">会社名</label>
                  <input
                    type="text"
                    value={safeGet(currentContent, 'footer.company')}
                    onChange={(e) => updateContent('footer', 'company', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明文</label>
                <textarea
                  rows={3}
                  value={safeGet(currentContent, 'footer.description')}
                  onChange={(e) => updateContent('footer', 'description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">著作権</label>
                <input
                  type="text"
                  value={safeGet(currentContent, 'footer.copyright')}
                  onChange={(e) => updateContent('footer', 'copyright', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">事業ドメインリンク</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ドメインタイトル</label>
                    <input
                      type="text"
                      value={safeGet(currentContent, 'footer.business_domains.title')}
                      onChange={(e) => updateContent('footer', 'business_domains', { ...safeGet(currentContent, 'footer.business_domains', {}), title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    {Object.entries(safeGet(currentContent, 'footer.business_domains.links', {})).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex gap-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateContent('footer', 'business_domains', {
                            ...safeGet(currentContent, 'footer.business_domains', {}),
                            links: { ...safeGet(currentContent, 'footer.business_domains.links', {}), [key]: e.target.value }
                          })}
                          className="flex-1 p-2 border border-gray-300 rounded text-gray-900 text-sm"
                          placeholder={key}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">ソーシャルリンク</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(safeGet(currentContent, 'footer.social_links', {})).map(([key, value]: [string, any]) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{key}</label>
                      <input
                        type="url"
                        value={value}
                        onChange={(e) => updateContent('footer', 'social_links', { ...safeGet(currentContent, 'footer.social_links', {}), [key]: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}