import BaseAPI from './BaseAPI';

class ProjectAPI extends BaseAPI {
  constructor() {
    super();
    this.storageFallback = BaseAPI.createStorageFallback('ProjectAPI');
  }

  // 프로젝트 목록 조회
  async getProjects() {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/project-posts`;
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
      return data;
    } catch (error) {
      console.error('프로젝트 목록 조회 실패:', error);
      throw new Error('프로젝트를 불러오는데 실패했습니다.');
    }
  }

  // 프로젝트 상세 조회
  async getProject(id) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/project-posts/${id}`;
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
      console.error('프로젝트 상세 조회 실패:', error);
      throw error;
    }
  }

  // 프로젝트 생성
  async createProject(projectData) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/project-posts`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || '프로젝트 등록 정보가 올바르지 않습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('프로젝트 생성 실패:', error);
      throw error;
    }
  }

  // 프로젝트 수정
  async updateProject(id, projectData) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/project-posts/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.message || '프로젝트 수정 정보가 올바르지 않습니다.');
        }
        if (response.status === 404) {
          throw new Error('프로젝트를 찾을 수 없습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('프로젝트 수정 실패:', error);
      throw error;
    }
  }

  // 프로젝트 삭제
  async deleteProject(id) {
    try {
      // 백엔드 API 직접 호출 (폴백 없이)
      const url = `${this.baseURL}/project-posts/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('프로젝트를 찾을 수 없습니다.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      throw error;
    }
  }
}

export default ProjectAPI;
