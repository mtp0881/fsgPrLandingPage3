'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContentData {
  hero: any;
  about: any;
  services: any;
  products: any;
  contact: any;
  partners: any;
  footer: any;
}

export function useContent() {
  const { language } = useLanguage();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/content');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setContent(data[language]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [language]);

  return { content, loading, error };
}
