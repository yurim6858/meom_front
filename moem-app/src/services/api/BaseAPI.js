import axios from 'axios';

// 공통 API 로직을 담은 기본 클래스
class BaseAPI {
  constructor(baseURL = 'http://localhost:8080/api') {
    this.baseURL = baseURL;
    
    // Axios 인스턴스 생성
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
    });

    // 요청 인터셉터 - 토큰 자동 추가
    this.axiosInstance.interceptors.request.use(config => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = token.startsWith('Bearer ') 
          ? token 
          : `Bearer ${token}`;
      }
      return config;
    });

    // 응답 인터셉터 - 에러 처리
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // GET 요청
  async get(endpoint, options = {}) {
    const response = await this.axiosInstance.get(endpoint, options);
    return response.data;
  }

  // POST 요청
  async post(endpoint, data, options = {}) {
    const response = await this.axiosInstance.post(endpoint, data, options);
    return response.data;
  }

  // PUT 요청
  async put(endpoint, data, options = {}) {
    const response = await this.axiosInstance.put(endpoint, data, options);
    return response.data;
  }

  // DELETE 요청
  async delete(endpoint, options = {}) {
    const response = await this.axiosInstance.delete(endpoint, options);
    return response.data;
  }

  // PATCH 요청
  async patch(endpoint, data, options = {}) {
    const response = await this.axiosInstance.patch(endpoint, data, options);
    return response.data;
  }

}

export default BaseAPI;
