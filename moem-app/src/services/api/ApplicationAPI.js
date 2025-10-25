import BaseAPI from './BaseAPI';

class ApplicationAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 프로젝트별 지원 목록 조회
  async getApplicationsByProject(projectId) {
    try {
      return await this.get(`/applications/project/${projectId}`);
    } catch (error) {
      console.error('프로젝트 지원 목록 조회 실패:', error);
      throw error;
    }
  }

  // 사용자별 지원 목록 조회
  async getApplicationsByUser(userId) {
    try {
      return await this.get(`/applications/user`, {
        headers: {
          'X-Username': userId
        }
      });
    } catch (error) {
      console.error('사용자 지원 목록 조회 실패:', error);
      throw error;
    }
  }

  // 지원 생성
  async createApplication(applicationData, username) {
    try {
      console.log('ApplicationAPI: 지원 생성 요청');
      console.log('ApplicationAPI: 데이터:', applicationData);
      console.log('ApplicationAPI: 사용자명:', username);
      
      const result = await this.post('/applications', applicationData, {
        headers: {
          'X-Username': username
        }
      });
      
      console.log('ApplicationAPI: 지원 생성 성공:', result);
      return result;
    } catch (error) {
      console.error('ApplicationAPI: 지원 생성 실패:', error);
      console.error('ApplicationAPI: 오류 응답:', error.response?.data);
      console.error('ApplicationAPI: 오류 상태:', error.response?.status);
      throw error;
    }
  }

  // 지원 수정
  async updateApplication(applicationId, applicationData) {
    try {
      return await this.put(`/applications/${applicationId}`, applicationData);
    } catch (error) {
      console.error('지원 수정 실패:', error);
      throw error;
    }
  }

  // 지원 삭제
  async deleteApplication(applicationId, username) {
    try {
      return await this.delete(`/applications/${applicationId}`, {
        headers: {
          'X-Username': username
        }
      });
    } catch (error) {
      console.error('지원 삭제 실패:', error);
      throw error;
    }
  }

  // 지원 상세 조회
  async getApplication(applicationId) {
    try {
      return await this.get(`/applications/${applicationId}`);
    } catch (error) {
      console.error('지원 상세 조회 실패:', error);
      throw error;
    }
  }

  // 지원 상태 변경 (승인/거부)
  async updateApplicationStatus(applicationId, status) {
    try {
      return await this.put(`/applications/${applicationId}/status?status=${status}`);
    } catch (error) {
      console.error('지원 상태 변경 실패:', error);
      throw error;
    }
  }

  // 지원 승인 및 팀 초대 발송
  async approveAndSendInvitation(applicationId) {
    try {
      return await this.post(`/applications/${applicationId}/approve-and-invite`, {}, {
        headers: {
          'X-Username': localStorage.getItem('username')
        }
      });
    } catch (error) {
      console.error('지원 승인 및 초대 발송 실패:', error);
      throw error;
    }
  }
}

export default ApplicationAPI;
