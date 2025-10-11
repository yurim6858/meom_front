// 모든 API 서비스를 통합하여 export
import ProjectAPI from './ProjectAPI';
import UserAPI from './UserAPI';
import AuthAPI from './AuthAPI';
import ApplicationAPI from './ApplicationAPI';

// 인스턴스 생성
const projectAPI = new ProjectAPI();
const userAPI = new UserAPI();
const authAPI = new AuthAPI();
const applicationAPI = new ApplicationAPI();

// 통합된 API 서비스 객체
const apiService = {
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
  
  
  // 인증 관련
  auth: {
    login: (credentials) => authAPI.login(credentials),
    register: (userData) => authAPI.register(userData),
    verifyToken: (token) => authAPI.verifyToken(token),
    logout: () => authAPI.logout(),
    changePassword: (current, newPassword) => authAPI.changePassword(current, newPassword),
    findCredentials: (email) => authAPI.findCredentials(email),
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
  }
};

// 개별 API 인스턴스도 export (필요한 경우)
export { ProjectAPI, UserAPI, AuthAPI, ApplicationAPI };

// 기본 export는 통합된 서비스
export default apiService;
