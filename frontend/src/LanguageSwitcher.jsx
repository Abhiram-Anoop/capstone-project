import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => changeLanguage(e.target.value)}
      className="border px-2 py-1 rounded"
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
      {/* <option value="pa">ਪੰਜਾਬੀ</option> */}
    </select>
  );
};

export default LanguageSwitcher;
