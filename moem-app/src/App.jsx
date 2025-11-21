import { Routes, Route } from "react-router-dom";
import './App.css'
import Layout from './components/layouts/Layout';
import ProjectListPage from './pages/Matching/ProjectListPage';
import ProjectCreatePage from './pages/Matching/ProjectCreatePage';
import ProjectDetailPage from './pages/Matching/ProjectDetailPage';
import ProjectEditPage from './pages/Matching/ProjectEditPage';
import UserListPage from './pages/Matching/UserListPage';
import UserDetailPage from './pages/Matching/UserDetailPage';
import UserCreatePage from './pages/Matching/UserCreatePage';
import UserEditPage from './pages/Matching/UserEditPage';
import ManagementPage from './pages/Matching/ManagementPage';
import LandingPage from "./pages/LandingPage";
import DashBoard from './pages/DashBoard';
import ReviewPage from "./pages/ReviewPage";
import MyPage from "./pages/MyPage";
// 초대 기능 제거됨 - 지원 승인 시 바로 팀 멤버 추가
// import MyInvitationsPage from "./pages/MyInvitationsPage";
import MyTeamsPage from "./pages/MyTeamsPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import TeamDetailPage from "./pages/TeamDetailPage";
import TeamEditPage from "./pages/TeamEditPage";
import TeamMembersPage from "./pages/TeamMembersPage";
// import TeamInvitationsPage from "./pages/TeamInvitationsPage";
import ProjectManagePage from "./pages/ProjectManagePage";
import AiRecommendPage from './pages/Matching/AiRecommendPage';

import LoginPage from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import AuthUserListPage from "./pages/AuthUserListPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path='/auth-users' element={<AuthUserListPage/>} />

        <Route element={<Layout />}>
          <Route path='/main' element={<DashBoard/>}/>
          <Route path='/project-posts' element={<ProjectListPage/>} />
          <Route path='/project-posts/:id' element={<ProjectDetailPage/>} />
          <Route path='/project-posts/:id/edit' element={<ProjectEditPage/>} />
          <Route path='/project-posts/new' element={<ProjectCreatePage/>} />
          <Route path='/users' element={<UserListPage/>}/>
          <Route path='/users/:id' element={<UserDetailPage/>} />
          <Route path='/users/:id/edit' element={<UserEditPage/>} />
          <Route path='/users/register' element={<UserCreatePage/>} />
          <Route path='/my-posts' element={<ManagementPage/>} />
          <Route path='/review' element={<ReviewPage/>} />
          <Route path='/mypage' element={<MyPage/>} />
          {/* 초대 기능 제거됨 - 지원 승인 시 바로 팀 멤버 추가 */}
          {/* <Route path='/my-invitations' element={<MyInvitationsPage/>} /> */}
          <Route path='/my-applications' element={<MyApplicationsPage/>} />
          <Route path='/my-teams' element={<MyTeamsPage/>} />
          <Route path='/my-projects' element={<MyProjectsPage/>} />
          <Route path='/teams/:id' element={<TeamDetailPage/>} />
          <Route path='/teams/:id/edit' element={<TeamEditPage/>} />
          <Route path='/teams/:id/members' element={<TeamMembersPage/>} />
          {/* 초대 기능 제거됨 - 지원 승인 시 바로 팀 멤버 추가 */}
          {/* <Route path='/teams/:id/invitations' element={<TeamInvitationsPage/>} /> */}
          <Route path='/projects/:id/manage' element={<ProjectManagePage/>} />
          <Route path="/matching/ai-recommend" element={<AiRecommendPage />} />
        </Route>
      </Routes>
  )
}

export default App
