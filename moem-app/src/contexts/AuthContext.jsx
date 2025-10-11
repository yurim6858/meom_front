import { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI } from '../services/api/index';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authAPI = new AuthAPI();

  useEffect(() => {
    // 페이지 로드 시 토큰 기반 인증 확인
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // 토큰 검증
          const verification = await authAPI.verifyToken(token);
          if (verification.valid) {
            // 토큰이 유효하면 사용자 정보를 백엔드에서 가져오기
            // 현재는 간단한 구현이므로 토큰만으로 로그인 상태로 간주
            console.log('토큰이 유효합니다. 로그인 상태로 설정합니다.');
            // TODO: 실제로는 토큰에서 사용자 정보를 추출하거나 백엔드에서 사용자 정보를 가져와야 함
          }
        }
      } catch (error) {
        console.error('인증 상태 확인 실패:', error);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authAPI.login(credentials);
      setUser(userData);
      // 토큰을 localStorage에 저장 (실제로는 JWT 토큰 사용)
      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
      }
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      // 토큰 제거
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      setUser(null); // 실패해도 로그아웃 처리
      localStorage.removeItem('authToken');
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await authAPI.register(userData);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    // 사용자 정보는 백엔드에서 관리하므로 localStorage에 저장하지 않음
  };

  const value = {
    user,
    login,
    logout,
    register,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};