import React from 'react';

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder = "검색어를 입력하세요", 
  className = "",
  ...props 
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors duration-200"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.6" 
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20 L17 17" />
      </svg>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label="검색"
        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-3 text-base outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 dark:border-gray-600 dark:bg-zinc-900 dark:text-white dark:focus:ring-blue-400 dark:focus:border-blue-400 dark:hover:border-gray-500"
        {...props}
      />
    </div>
  );
};

export default SearchInput;
