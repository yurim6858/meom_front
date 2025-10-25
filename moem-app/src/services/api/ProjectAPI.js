import BaseAPI from './BaseAPI';

class ProjectAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 프로젝트 목록 조회
  async getProjects() {
    try {
      return await this.get('/project-posts');
    } catch (error) {
      console.error('프로젝트 목록 조회 실패:', error);
      throw new Error('프로젝트를 불러오는데 실패했습니다.');
    }
  }

  // 프로젝트 상세 조회
  async getProject(id) {
    try {
      return await this.get(`/project-posts/${id}`);
    } catch (error) {
      console.error('프로젝트 상세 조회 실패:', error);
      if (error.message.includes('404')) {
        throw new Error('NOT_FOUND');
      }
      throw error;
    }
  }

  // 프로젝트 생성
  async createProject(projectData) {
    try {
      console.log('ProjectAPI: 프로젝트 생성 요청 데이터:', projectData);
      console.log('ProjectAPI: creatorId 타입:', typeof projectData.creatorId, '값:', projectData.creatorId);
      const response = await this.post('/project-posts', projectData);
      console.log('ProjectAPI: 프로젝트 생성 성공:', response);
      return response;
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      console.error('에러 응답:', error.response?.data);
      console.error('에러 상태:', error.response?.status);
      throw error;
    }
  }

  // 프로젝트 수정
  async updateProject(id, projectData) {
    try {
      return await this.put(`/project-posts/${id}`, projectData);
    } catch (error) {
      console.error('프로젝트 수정 실패:', error);
      throw error;
    }
  }

  // 프로젝트 삭제
  async deleteProject(id) {
    try {
      return await this.delete(`/project-posts/${id}`);
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      throw error;
    }
  }
}

export default ProjectAPI;
