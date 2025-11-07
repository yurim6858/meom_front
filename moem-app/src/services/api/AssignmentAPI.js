import BaseAPI from './BaseAPI';

class AssignmentAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 프로젝트의 과제 목록 조회
  async getAssignmentsByProject(projectId) {
    try {
      return await this.get(`/team-assignments/project/${projectId}`);
    } catch (error) {
      console.error('과제 목록 조회 실패:', error);
      throw error;
    }
  }

  // 프로젝트와 사용자의 과제 목록 조회
  async getAssignmentsByProjectAndUser(projectId, userId) {
    try {
      return await this.get(`/team-assignments/project/${projectId}/user/${userId}`);
    } catch (error) {
      console.error('과제 목록 조회 실패:', error);
      throw error;
    }
  }

  // 과제 생성
  async createAssignment(data) {
    try {
      return await this.post('/team-assignments', data);
    } catch (error) {
      console.error('과제 생성 실패:', error);
      throw error;
    }
  }

  // 과제 수정
  async updateAssignment(id, data) {
    try {
      return await this.put(`/team-assignments/${id}`, data);
    } catch (error) {
      console.error('과제 수정 실패:', error);
      throw error;
    }
  }

  // 과제 삭제
  async deleteAssignment(id) {
    try {
      return await this.delete(`/team-assignments/${id}`);
    } catch (error) {
      console.error('과제 삭제 실패:', error);
      throw error;
    }
  }

  // AI를 사용하여 과제 자동 생성
  async generateAssignmentsWithAI(projectId) {
    try {
      return await this.post(`/team-assignments/ai/generate/${projectId}`);
    } catch (error) {
      console.error('AI 과제 생성 실패:', error);
      throw error;
    }
  }

  // AI를 사용하여 일정 자동 생성
  async generateScheduleWithAI(projectId) {
    try {
      return await this.post(`/team-assignments/ai/schedule/${projectId}`);
    } catch (error) {
      console.error('AI 일정 생성 실패:', error);
      throw error;
    }
  }
}

export default AssignmentAPI;

