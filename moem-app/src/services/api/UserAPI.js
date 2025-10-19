import BaseAPI from './BaseAPI';

class UserAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 사용자 목록 조회 (프로필이 등록된 사용자만)
  async getUsers() {
    try {
      const data = await this.get('/user-profiles');
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
      return await this.get(`/user-profiles/${id}`);
    } catch (error) {
      console.log('사용자 상세 조회 실패:', error);
      if (error.message.includes('404')) {
        throw new Error('NOT_FOUND');
      }
      throw error;
    }
  }

  // 사용자 생성
  async createUser(userData) {
    try {
      return await this.post('/user-profiles', userData);
    } catch (error) {
      console.error('사용자 생성 실패:', error);
      throw error;
    }
  }

  // 사용자 수정
  async updateUser(id, userData) {
    try {
      return await this.put(`/user-profiles/${id}`, userData);
    } catch (error) {
      console.error('사용자 수정 실패:', error);
      throw error;
    }
  }

  // 사용자 삭제
  async deleteUser(id) {
    try {
      return await this.delete(`/user-profiles/${id}`);
    } catch (error) {
      console.error('사용자 삭제 실패:', error);
      throw error;
    }
  }
}

export default UserAPI;
