
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const Ctx = createContext({
  user: null,
  refresh: async () => {},
  lang: 'bn',
  setLang: () => {},
});

export function SiteProvider({ children }) {
  const [user, setUser] = useState(null);
  const [lang, setLangState] = useState('bn');

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('novaloom-language');

    if (savedLang === 'bn' || savedLang === 'en') {
      setLangState(savedLang);
    }
  }, []);

  // Update HTML language
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Change and save language
  const setLang = (language) => {
    if (language !== 'bn' && language !== 'en') return;

    setLangState(language);
    localStorage.setItem('novaloom-language', language);
  };

  // Existing authentication system
  const refresh = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        refresh,
        lang,
        setLang,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useSite = () => useContext(Ctx);
