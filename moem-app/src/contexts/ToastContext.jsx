import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/shared/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      message: toast.message || '메시지가 지정되지 않았습니다.',
      type: toast.type || 'info',
      duration: toast.duration || 3000,
      isVisible: true
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // 편의 메서드들
  const showSuccess = useCallback((message, duration) => {
    return addToast({ message, type: 'success', duration });
  }, [addToast]);

  const showError = useCallback((message, duration) => {
    return addToast({ message, type: 'error', duration: duration || 5000 });
  }, [addToast]);

  const showWarning = useCallback((message, duration) => {
    return addToast({ message, type: 'warning', duration });
  }, [addToast]);

  const showInfo = useCallback((message, duration) => {
    return addToast({ message, type: 'info', duration });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* 토스트 컨테이너 */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            isVisible={toast.isVisible}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
