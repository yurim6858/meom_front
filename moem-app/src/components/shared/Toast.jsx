import React, { useEffect } from 'react';

const Toast = ({ 
  message, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  duration = 3000,
  isVisible,
  onClose 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    const baseStyles = "fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 z-50";
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white border border-green-600`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white border border-red-600`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white border border-yellow-600`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500 text-white border border-blue-600`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">,m;o
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" stroke-plusWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div 
      className={getToastStyles()}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center space-x-3">
        <span className="flex-shrink-0">
          {getIcon()}
        </span>
        <span className="flex-1 text-sm font-medium">
          {message}
        </span>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          aria-label="알림 닫기"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
