import { Routes, Route } from "react-router-dom";
import './App.css'
import Layout from './components/layouts/layout';
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

import LoginPage from "./pages/auth/LoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import AuthUserListPage from "./pages/AuthUserListPage";
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
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
        </Route>
        </Routes> 
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
