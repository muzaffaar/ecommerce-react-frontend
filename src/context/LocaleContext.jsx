import { createContext, useContext, useState, useEffect } from "react";

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(localStorage.getItem("lang") || "en");

  const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem("lang", newLocale);
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("lang");
    if (storedLang && storedLang !== locale) {
      setLocale(storedLang);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
