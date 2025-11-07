import BaseAPI from './BaseAPI';

class TeamAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 팀 목록 조회
  async getTeams() {
    return await this.get('/teams');
  }

  // 팀 상세 정보 조회 (멤버 포함) - RESTful 스타일
  async getTeamInfo(teamId) {
    return await this.get(`/teams/${teamId}`);
  }

  // 팀 상세 정보 조회 (하위 호환성 유지, deprecated)
  async getTeamInfoLegacy(teamId) {
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

  // 팀 생성 (RESTful 스타일)
  async createTeam(projectId, teamData) {
    return await this.post(`/teams/projects/${projectId}`, teamData, {
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
    return await this.get(`/teams/${teamId}/start-ready/${projectId}`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 프로젝트 시작
  async startProject(teamId, projectId) {
    return await this.post(`/teams/${teamId}/start-project`, {
      projectId: projectId
    }, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 팀 멤버 제거
  async removeMember(teamId, memberId) {
    return await this.delete(`/teams/${teamId}/members/${memberId}`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }
}

export default TeamAPI;
