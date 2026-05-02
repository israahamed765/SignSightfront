"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchSection({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  // وظيفة يتم استدعاؤها عند الضغط على زر البحث
  const handleSearch = () => {
    onSearch(searchTerm);
  };

  // وظيفة للبحث عند الضغط على Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative ">
      {/* أيقونة البحث */}
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <Search className="text-primary text-2xl" size={24} />
      </div>

      {/* حقل الإدخال */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value); // تصفية فورية أثناء الكتابة
        }}
        onKeyDown={handleKeyDown}
        className="w-full h-14 pr-12 pl-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-lg text-slate-900"
        placeholder="ابحث عن كلمة، جملة، أو حرف..."
      />

      {/* زر البحث */}
      <button
        onClick={handleSearch}
        className="absolute inset-y-2 left-2 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
      >
        بحث سريع
      </button>
    </div>
  );
}
