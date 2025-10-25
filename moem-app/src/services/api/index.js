// 모든 API 서비스를 통합하여 export
import AuthAPI from './AuthAPI';
import ProjectAPI from './ProjectAPI';
import UserAPI from './UserAPI';
import ApplicationAPI from './ApplicationAPI';
import TeamInvitationAPI from './TeamInvitationAPI';
import TeamAPI from './TeamAPI';

// 인스턴스 생성
const authAPI = new AuthAPI();
const projectAPI = new ProjectAPI();
const userAPI = new UserAPI();
const applicationAPI = new ApplicationAPI();
const teamInvitationAPI = new TeamInvitationAPI();
const teamAPI = new TeamAPI();

// 통합된 API 서비스 객체
const apiService = {
  // 인증 관련
  auth: {
    login: (data) => authAPI.login(data),
    signup: (data) => authAPI.signup(data),
    saveToken: (token, username) => authAPI.saveToken(token, username),
    removeToken: () => authAPI.removeToken(),
    getToken: () => authAPI.getToken(),
    getCurrentUser: () => authAPI.getCurrentUser(),
    getAuthUsers: () => authAPI.getAuthUsers(),
  },
  
  // 프로젝트 관련
  projects: {
    getAll: () => projectAPI.getProjects(),
    getById: (id) => projectAPI.getProject(id),
    create: (data) => projectAPI.createProject(data),
    update: (id, data) => projectAPI.updateProject(id, data),
    delete: (id) => projectAPI.deleteProject(id),
  },
  
  // 사용자 관련
  users: {
    getAll: () => userAPI.getUsers(),
    getById: (id) => userAPI.getUser(id),
    create: (data) => userAPI.createUser(data),
    update: (id, data) => userAPI.updateUser(id, data),
    delete: (id) => userAPI.deleteUser(id),
  },
  
  
  // 지원 관련
  applications: {
    getByProject: (projectId) => applicationAPI.getApplicationsByProject(projectId),
    getByUser: (userId) => applicationAPI.getApplicationsByUser(userId),
    create: (data) => applicationAPI.createApplication(data),
    update: (id, data) => applicationAPI.updateApplication(id, data),
    delete: (id) => applicationAPI.deleteApplication(id),
    getById: (id) => applicationAPI.getApplication(id),
    updateStatus: (id, status) => applicationAPI.updateApplicationStatus(id, status),
    approveAndInvite: (id) => applicationAPI.approveAndSendInvitation(id),
  },

  // 팀 초대 관련
  invitations: {
    send: (teamId, data) => teamInvitationAPI.sendInvitation(teamId, data),
    getMy: () => teamInvitationAPI.getMyInvitations(),
    getMyPending: () => teamInvitationAPI.getMyPendingInvitations(),
    getById: (id) => teamInvitationAPI.getInvitation(id),
    respond: (id, status) => teamInvitationAPI.respondToInvitation(id, status),
    getByTeam: (teamId) => teamInvitationAPI.getTeamInvitations(teamId),
    cancel: (id) => teamInvitationAPI.cancelInvitation(id),
  },

  // 팀 관련
  teams: {
    getAll: () => teamAPI.getTeams(),
    getById: (id) => teamAPI.getTeamInfo(id),
    getTeamInfo: (id) => teamAPI.getTeamInfo(id),
    getMy: () => teamAPI.getMyTeams(),
    create: (data) => teamAPI.createTeam(data),
    update: (id, data) => teamAPI.updateTeam(id, data),
    delete: (id) => teamAPI.deleteTeam(id),
    checkStartReady: (teamId, projectId) => teamAPI.checkStartReady(teamId, projectId),
    startProject: (teamId, projectId) => teamAPI.startProject(teamId, projectId),
  }
};

// 개별 API 인스턴스도 export (필요한 경우)
export { AuthAPI, ProjectAPI, UserAPI, ApplicationAPI, TeamInvitationAPI, TeamAPI };

// 기본 export는 통합된 서비스
export default apiService;
