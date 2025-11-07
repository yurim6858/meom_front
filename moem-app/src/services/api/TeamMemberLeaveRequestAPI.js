import BaseAPI from './BaseAPI';

class TeamMemberLeaveRequestAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 팀원 나가기 요청 생성
  async createLeaveRequest(teamId, memberId, reason) {
    return await this.post(`/teams/${teamId}/leave-requests/members/${memberId}`, { reason }, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 팀의 나가기 요청 목록 조회 (리더용)
  async getLeaveRequestsByTeam(teamId) {
    return await this.get(`/teams/${teamId}/leave-requests`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 팀의 대기중인 나가기 요청 목록 조회 (리더용)
  async getPendingLeaveRequestsByTeam(teamId) {
    return await this.get(`/teams/${teamId}/leave-requests/pending`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 나가기 요청 승인/거절 (리더용)
  async respondToLeaveRequest(teamId, leaveRequestId, status) {
    return await this.put(`/teams/${teamId}/leave-requests/${leaveRequestId}/respond`, { status }, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }
}

export default TeamMemberLeaveRequestAPI;

