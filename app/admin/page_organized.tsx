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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">管理者パネル</h1>
              <span className="text-sm text-gray-500">
                📄 メインページと同じ順序で編集
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'jp' | 'vn')}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="jp">日本語</option>
                <option value="vn">Tiếng Việt</option>
              </select>
              <button
                onClick={saveContent}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
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
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{message}</p>
          </div>
        )}

        {/* Navigation Guide */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">📋 ページ構成ガイド</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-blue-700">1. Hero → 2. About</div>
            <div className="text-blue-700">3. Services → 4. Partners</div>
            <div className="text-blue-700">5. Global Network → 6. Contact</div>
            <div className="text-blue-700">7. Footer</div>
          </div>
        </div>

        <div className="space-y-8">
          {/* 1. ヒーローセクション - Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">1</span>
                ヒーローセクション
              </h2>
              <span className="text-sm text-gray-500">Hero Section - トップページメイン</span>
            </div>
            
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

          {/* 2. Aboutセクション - About Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">2</span>
                Aboutセクション
              </h2>
              <span className="text-sm text-gray-500">About Section - 会社概要</span>
            </div>
            
            <div className="space-y-4">
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

          {/* Compact placeholder for other sections */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">🚧 Layout Reorganization In Progress</p>
              <p className="text-sm">
                Các section khác (3. Services, 4. Partners, 5. Global Network, 6. Contact, 7. Footer) 
                sẽ được tổ chức lại theo thứ tự tương tự.
              </p>
              <p className="text-xs mt-2 text-blue-600">
                Hiện tại vẫn có thể sử dụng admin cũ bình thường!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
