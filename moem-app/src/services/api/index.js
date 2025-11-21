// 모든 API 서비스를 통합하여 export
import AuthAPI from './AuthAPI';
import ProjectAPI from './ProjectAPI';
import UserAPI from './UserAPI';
import ApplicationAPI from './ApplicationAPI';
import TeamAPI from './TeamAPI';
import TeamMemberLeaveRequestAPI from './TeamMemberLeaveRequestAPI';
import AssignmentAPI from './AssignmentAPI';

// 인스턴스 생성
const authAPI = new AuthAPI();
const projectAPI = new ProjectAPI();
const userAPI = new UserAPI();
const applicationAPI = new ApplicationAPI();
const teamAPI = new TeamAPI();
const teamMemberLeaveRequestAPI = new TeamMemberLeaveRequestAPI();
const assignmentAPI = new AssignmentAPI();

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
    getMy: () => projectAPI.getMyProjects(),
    getStartedProject: (id) => projectAPI.getStartedProject(id),
    endProject: (id) => projectAPI.endProject(id),
    updateEntity: (id, data) => projectAPI.updateProjectEntity(id, data),
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
    getByProjectGroupedByPosition: (projectId) => applicationAPI.getApplicationsByProjectGroupedByPosition(projectId),
    getByUser: (userId) => applicationAPI.getApplicationsByUser(userId),
    create: (data) => applicationAPI.createApplication(data),
    update: (id, data) => applicationAPI.updateApplication(id, data),
    delete: (id) => applicationAPI.deleteApplication(id),
    getById: (id) => applicationAPI.getApplication(id),
    updateStatus: (id, status) => applicationAPI.updateApplicationStatus(id, status),
    approveAndAddToTeam: (id) => applicationAPI.approveAndAddToTeam(id),
    approveAndInvite: (id) => applicationAPI.approveAndSendInvitation(id), // deprecated
  },

  // 팀 초대 관련 (제거됨 - 지원 승인 시 바로 팀 멤버 추가)
  // invitations: {
  //   send: (teamId, data) => teamInvitationAPI.sendInvitation(teamId, data),
  //   getMy: () => teamInvitationAPI.getMyInvitations(),
  //   getMyPending: () => teamInvitationAPI.getMyPendingInvitations(),
  //   getById: (id) => teamInvitationAPI.getInvitation(id),
  //   respond: (id, status) => teamInvitationAPI.respondToInvitation(id, status),
  //   getByTeam: (teamId) => teamInvitationAPI.getTeamInvitations(teamId),
  //   cancel: (id) => teamInvitationAPI.cancelInvitation(id),
  // },

  // 팀 관련
  teams: {
    getAll: () => teamAPI.getTeams(),
    getById: (id) => teamAPI.getTeamInfo(id),
    getTeamInfo: (id) => teamAPI.getTeamInfo(id),
    getMy: () => teamAPI.getMyTeams(),
    create: (projectId, data) => teamAPI.createTeam(projectId, data),
    update: (id, data) => teamAPI.updateTeam(id, data),
    delete: (id) => teamAPI.deleteTeam(id),
    checkStartReady: (teamId, projectId) => teamAPI.checkStartReady(teamId, projectId),
    startProject: (teamId, projectId) => teamAPI.startProject(teamId, projectId),
    removeMember: (teamId, memberId) => teamAPI.removeMember(teamId, memberId),
  },

  // 팀원 나가기 요청 관련
  leaveRequests: {
    create: (teamId, memberId, reason) => teamMemberLeaveRequestAPI.createLeaveRequest(teamId, memberId, reason),
    getByTeam: (teamId) => teamMemberLeaveRequestAPI.getLeaveRequestsByTeam(teamId),
    getPendingByTeam: (teamId) => teamMemberLeaveRequestAPI.getPendingLeaveRequestsByTeam(teamId),
    respond: (teamId, leaveRequestId, status) => teamMemberLeaveRequestAPI.respondToLeaveRequest(teamId, leaveRequestId, status),
  },

  // 과제 관련
  assignments: {
    getByProject: (projectId) => assignmentAPI.getAssignmentsByProject(projectId),
    getByProjectAndUser: (projectId, userId) => assignmentAPI.getAssignmentsByProjectAndUser(projectId, userId),
    create: (data) => assignmentAPI.createAssignment(data),
    update: (id, data) => assignmentAPI.updateAssignment(id, data),
    delete: (id) => assignmentAPI.deleteAssignment(id),
    updateStatus: (id, data) => assignmentAPI.updateAssignmentStatus(id, data),
    generateWithAI: (projectId) => assignmentAPI.generateAssignmentsWithAI(projectId),
    generateScheduleWithAI: (projectId) => assignmentAPI.generateScheduleWithAI(projectId),
    generateFullScheduleWithAI: (projectId) => assignmentAPI.generateFullScheduleWithAI(projectId),
  },

  // 주간 리포트 관련
  weeklyReports: {
    getByProject: (projectId) => assignmentAPI.getWeeklyReports(projectId),
    getByWeek: (projectId, weekStartDate) => assignmentAPI.getWeeklyReport(projectId, weekStartDate),
  }
};

// 개별 API 인스턴스도 export (필요한 경우)
export { AuthAPI, ProjectAPI, UserAPI, ApplicationAPI, TeamAPI, AssignmentAPI };

// 기본 export는 통합된 서비스
export default apiService;
