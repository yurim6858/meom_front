import BaseAPI from './BaseAPI';

class AuthAPI extends BaseAPI {
  constructor() {
    super();
    this.storageFallback = BaseAPI.createStorageFallback('auth');
  }

  // 로그인
  async login(credentials) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || '로그인 정보가 올바르지 않습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.message && data.message !== "로그인 성공") {
        throw new Error(data.message);
      }
      
      // 백엔드 응답을 프론트엔드 형식으로 변환
      const user = {
        id: data.userId,
        email: data.email,
        username: data.username,
        token: data.token
      };
      
      return user;
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  }

  // 회원가입
  async register(userData) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/auth/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
          password: userData.password
        })
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || '회원가입 정보가 올바르지 않습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.message && data.message !== "회원가입이 완료되었습니다.") {
        throw new Error(data.message);
      }
      
      // 백엔드 응답을 프론트엔드 형식으로 변환
      const user = {
        id: data.userId,
        email: data.email,
        username: data.username,
        token: data.token
      };
      
      return user;
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    }
  }

  // 토큰 검증 (현재는 간단한 구현)
  async verifyToken(token) {
    try {
      if (!token) {
        throw new Error('토큰이 없습니다.');
      }
      
      // TODO: 실제로는 백엔드에서 토큰 검증 API 호출
      // const response = await this.get('/auth/verify', { 
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return response;
      
      // 임시로 토큰이 있으면 유효한 것으로 간주
      return { valid: true, token };
    } catch (error) {
      console.error('토큰 검증 실패:', error);
      throw error;
    }
  }

  // 로그아웃
  async logout() {
    try {
      // 백엔드 API 시도 (백엔드에서 구현되면 이 부분으로 교체)
      // return await this.post('/auth/logout');
      
      // 현재: 토큰만 제거 (AuthContext에서 처리)
      return true;
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  }

  // 비밀번호 변경
  async changePassword(currentPassword, newPassword) {
    try {
      // 백엔드 API 시도 (백엔드에서 구현되면 이 부분으로 교체)
      // return await this.put('/auth/password', { currentPassword, newPassword });
      
      // 현재: 실제 구현 필요
      throw new Error('비밀번호 변경 기능은 아직 구현되지 않았습니다.');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      throw error;
    }
  }

  // 아이디/비밀번호 찾기
  async findCredentials(email) {
    try {
      // 백엔드 API 시도 (백엔드에서 구현되면 이 부분으로 교체)
      // return await this.post('/auth/find', { email });
      
      // 현재: 실제 구현 필요
      throw new Error('아이디/비밀번호 찾기 기능은 아직 구현되지 않았습니다.');
    } catch (error) {
      console.error('아이디/비밀번호 찾기 실패:', error);
      throw error;
    }
  }

}

export default AuthAPI;
