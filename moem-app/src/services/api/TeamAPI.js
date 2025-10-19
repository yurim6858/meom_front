import BaseAPI from './BaseAPI';

class TeamAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 팀 목록 조회
  async getTeams() {
    return await this.get('/teams');
  }

  // 팀 상세 정보 조회 (멤버 포함)
  async getTeamInfo(teamId) {
    return await this.get(`/teams/${teamId}/info`);
  }

  // 내가 속한 팀 목록 조회
  async getMyTeams() {
    return await this.get('/teams/my', {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 팀 생성
  async createTeam(teamData) {
    return await this.post('/teams', teamData, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 팀 수정
  async updateTeam(teamId, teamData) {
    return await this.put(`/teams/${teamId}`, teamData, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 팀 삭제
  async deleteTeam(teamId) {
    return await this.delete(`/teams/${teamId}`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 프로젝트 시작 준비 상태 확인
  async checkStartReady(teamId, projectId) {
    return await this.get(`/teams/${teamId}/start-ready/${projectId}`);
  }

  // 프로젝트 시작
  async startProject(teamId, projectId) {
    return await this.post(`/teams/${teamId}/start-project`, {
      projectId: projectId
    });
  }
}

export default TeamAPI;
