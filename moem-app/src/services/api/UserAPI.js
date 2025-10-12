import BaseAPI from './BaseAPI';

class UserAPI extends BaseAPI {
  constructor() {
    super();
    this.storageFallback = BaseAPI.createStorageFallback('UserAPI');
  }

  // 사용자 목록 조회 (프로필이 등록된 사용자만)
  async getUsers() {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/user-profiles`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${data.length}개의 사용자 프로필 로드`);
      return data;
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
      throw new Error('사용자를 불러오는데 실패했습니다.');
    }
  }

  // 사용자 상세 조회
  async getUser(id) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/user-profiles/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NOT_FOUND');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('사용자 상세 조회 실패:', error);
      throw error;
    }
  }

  // 사용자 생성
  async createUser(userData) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/user-profiles`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || '사용자 등록 정보가 올바르지 않습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('사용자 생성 실패:', error);
      throw error;
    }
  }

  // 사용자 수정
  async updateUser(id, userData) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/user-profiles/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || '사용자 수정 정보가 올바르지 않습니다.');
        }
        if (response.status === 404) {
          throw new Error('사용자를 찾을 수 없습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('사용자 수정 실패:', error);
      throw error;
    }
  }

  // 사용자 삭제
  async deleteUser(id) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/user-profiles/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('사용자를 찾을 수 없습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
      throw error;
    }
  }
}

export default UserAPI;
