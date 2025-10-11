import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(localStorage.getItem("lang") || "en");

  // keep localStorage synced
  useEffect(() => {
    localStorage.setItem("lang", locale);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
