import BaseAPI from './BaseAPI';

class TeamInvitationAPI extends BaseAPI {
  constructor() {
    super();
  }

  // 팀 초대 발송
  async sendInvitation(teamId, invitationData) {
    return await this.post(`/teams/${teamId}/invitations`, invitationData, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 내가 받은 초대 목록 조회
  async getMyInvitations() {
    return await this.get('/teams/invitations/my', {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 내가 받은 대기중인 초대 목록 조회
  async getMyPendingInvitations() {
    return await this.get('/teams/invitations/my/pending', {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 초대 상세 조회
  async getInvitation(invitationId) {
    return await this.get(`/teams/invitations/${invitationId}`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 초대 응답 (수락/거절)
  async respondToInvitation(invitationId, status) {
    return await this.put(`/teams/invitations/${invitationId}/respond`, { status }, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 팀의 초대 목록 조회 (팀 관리자용)
  async getTeamInvitations(teamId) {
    return await this.get(`/teams/${teamId}/invitations`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }

  // 초대 취소 (팀 관리자용)
  async cancelInvitation(invitationId) {
    return await this.delete(`/teams/invitations/${invitationId}`, {
      headers: {
        'X-Username': localStorage.getItem('username')
      }
    });
  }
}

export default TeamInvitationAPI;
