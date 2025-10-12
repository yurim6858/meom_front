// 공통 API 로직을 담은 기본 클래스
class BaseAPI {
  constructor(baseURL = 'http://localhost:8080/api') {
    this.baseURL = baseURL;
  }

  // 공통 요청 메서드
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 응답이 비어있을 수 있으므로 확인
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return response;
      }
    } catch (error) {
      console.log(`백엔드 서버 연결 실패, localStorage 사용: ${endpoint}`);
      // 백엔드 서버가 연결되지 않으면 localStorage 폴백 사용
      return this.getFallbackData(endpoint);
    }
  }

  // GET 요청
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  // POST 요청
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 요청
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 요청
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // 백엔드 서버가 연결되지 않을 때 사용할 폴백 데이터
  getFallbackData(endpoint) {
    console.log(`폴백 데이터 요청: ${endpoint}`);
    
    if (endpoint === '/project-posts' || endpoint.includes('/project-posts')) {
      return this.getLocalStorageData('recruitments') || [];
    } else if (endpoint === '/users' || endpoint.includes('/users')) {
      return this.getLocalStorageData('mockUsers') || [];
    }
    return [];
  }

  // localStorage에서 데이터 가져오기
  getLocalStorageData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`localStorage에서 ${key} 데이터 로드 실패:`, error);
      return null;
    }
  }

  // localStorage에 데이터 저장하기 (POST/PUT/DELETE 작업용)
  setLocalStorageData(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`localStorage에 ${key} 데이터 저장 실패:`, error);
      return false;
    }
  }

  // localStorage 폴백 클래스
  static createStorageFallback(serviceName) {
    return class StorageFallback {
      static getStorageKey(key) {
        return `${serviceName}_${key}`;
      }

      static getItem(key, defaultValue = []) {
        try {
          const item = localStorage.getItem(this.getStorageKey(key));
          return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
          console.error(`${key} 파싱 실패:`, error);
          return defaultValue;
        }
      }

      static setItem(key, value) {
        try {
          localStorage.setItem(this.getStorageKey(key), JSON.stringify(value));
          return true;
        } catch (error) {
          console.error(`${key} 저장 실패:`, error);
          return false;
        }
      }

      static removeItem(key) {
        try {
          localStorage.removeItem(this.getStorageKey(key));
          return true;
        } catch (error) {
          console.error(`${key} 삭제 실패:`, error);
          return false;
        }
      }
    };
  }
}

export default BaseAPI;
