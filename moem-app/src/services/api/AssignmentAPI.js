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

  // AI를 사용하여 전체 스케줄 생성 (프로젝트 타입별 템플릿 + 주차별 스케줄링)
  // 이 작업은 시간이 오래 걸릴 수 있으므로 타임아웃을 5분으로 설정
  async generateFullScheduleWithAI(projectId) {
    try {
      return await this.post(`/team-assignments/ai/full-schedule/${projectId}`, null, {
        timeout: 300000 // 5분 (300초)
      });
    } catch (error) {
      console.error('AI 전체 스케줄 생성 실패:', error);
      throw error;
    }
  }

  // 과제 상태 업데이트
  async updateAssignmentStatus(id, data) {
    try {
      return await this.put(`/team-assignments/${id}/status`, data);
    } catch (error) {
      console.error('과제 상태 업데이트 실패:', error);
      throw error;
    }
  }

  // 주간 리포트 목록 조회
  async getWeeklyReports(projectId) {
    try {
      return await this.get(`/weekly-reports/project/${projectId}`);
    } catch (error) {
      console.error('주간 리포트 조회 실패:', error);
      throw error;
    }
  }

  // 특정 주차 리포트 조회
  async getWeeklyReport(projectId, weekStartDate) {
    try {
      return await this.get(`/weekly-reports/project/${projectId}/week/${weekStartDate}`);
    } catch (error) {
      console.error('주간 리포트 조회 실패:', error);
      throw error;
    }
  }
}

export default AssignmentAPI;

