import BaseAPI from './BaseAPI';

class AuthAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 로그인
  async login(loginData) {
    try {
      return await this.post('/auth/login', loginData);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('아이디나 비밀번호가 잘못되었습니다.');
      }
      console.error('로그인 실패:', error);
      throw error;
    }
  }

  // 회원가입
  async signup(signupData) {
    try {
      return await this.post('/auth/signup', signupData);
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data || '회원가입 정보가 올바르지 않습니다.');
      }
      console.error('회원가입 실패:', error);
      throw error;
    }
  }

  // 토큰 저장
  saveToken(token, username) {
    console.log('AuthAPI: 토큰 저장 중...');
    console.log('AuthAPI: 토큰:', token ? token.substring(0, 20) + '...' : 'null');
    console.log('AuthAPI: 사용자명:', username);
    
    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', username);
    
    console.log('AuthAPI: 토큰 저장 완료');
    console.log('AuthAPI: 저장된 토큰 확인:', localStorage.getItem('accessToken') ? '있음' : '없음');
  }

  // 토큰 제거
  removeToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
  }

  // 토큰 가져오기
  getToken() {
    return localStorage.getItem('accessToken');
  }

  // 사용자 정보 가져오기
  getCurrentUser() {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('accessToken');
    return username && token ? { username, token } : null;
  }

  // 인증된 요청을 위한 헤더 생성
  getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // 인증된 사용자 목록 조회 (auth 데이터베이스) - 확인용으로 인증 없이 접근
  async getAuthUsers() {
    try {
      console.log('AuthAPI: 요청 URL:', `${this.baseURL}/auth/users`);
      console.log('AuthAPI: 요청 시작...');
      
      const data = await this.get('/auth/users');
      console.log('AuthAPI: 응답 데이터:', data);
      return data;
    } catch (error) {
      console.error('AuthAPI: 인증 사용자 목록 조회 실패:', error);
      throw error;
    }
  }
}

export default AuthAPI;
