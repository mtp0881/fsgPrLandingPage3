import { useState, useEffect } from 'react';
import { useLanguage } from '../app/contexts/LanguageContext';

interface SlidesData {
  finance: string[];
  legacy: string[];
  public: string[];
  salesforce: string[];
  fpt: string[];
}

interface ContentSection {
  [key: string]: any;
  slides?: SlidesData;
}

interface ContentData {
  jp: ContentSection;
  vn: ContentSection;
}

export function useContent() {
  const { language } = useLanguage();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data: ContentData = await response.json();
        setContent(data[language]);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [language]);

  return { content, loading, error };
}
