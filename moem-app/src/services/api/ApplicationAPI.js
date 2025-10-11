import BaseAPI from './BaseAPI';

class ApplicationAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 프로젝트별 지원 목록 조회
  async getApplicationsByProject(projectId) {
    try {
      const response = await this.request(`/applications/project/${projectId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('프로젝트 지원 목록 조회 실패:', error);
      throw error;
    }
  }

  // 사용자별 지원 목록 조회
  async getApplicationsByUser(userId) {
    try {
      const response = await this.request(`/applications/user`, {
        method: 'GET',
        headers: {
          'X-Username': userId
        }
      });
      return response;
    } catch (error) {
      console.error('사용자 지원 목록 조회 실패:', error);
      throw error;
    }
  }

  // 지원 생성
  async createApplication(applicationData, username) {
    try {
      const response = await this.request('/applications', {
        method: 'POST',
        headers: {
          'X-Username': username
        },
        body: JSON.stringify(applicationData)
      });
      return response;
    } catch (error) {
      console.error('지원 생성 실패:', error);
      throw error;
    }
  }

  // 지원 수정
  async updateApplication(applicationId, applicationData) {
    try {
      const response = await this.request(`/applications/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify(applicationData)
      });
      return response;
    } catch (error) {
      console.error('지원 수정 실패:', error);
      throw error;
    }
  }

  // 지원 삭제
  async deleteApplication(applicationId, username) {
    try {
      const response = await this.request(`/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'X-Username': username
        }
      });
      return response;
    } catch (error) {
      console.error('지원 삭제 실패:', error);
      throw error;
    }
  }

  // 지원 상세 조회
  async getApplication(applicationId) {
    try {
      const response = await this.request(`/applications/${applicationId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('지원 상세 조회 실패:', error);
      throw error;
    }
  }

  // 지원 상태 변경 (승인/거부)
  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await this.request(`/applications/${applicationId}/status?status=${status}`, {
        method: 'PUT'
      });
      return response;
    } catch (error) {
      console.error('지원 상태 변경 실패:', error);
      throw error;
    }
  }
}

export default ApplicationAPI;
