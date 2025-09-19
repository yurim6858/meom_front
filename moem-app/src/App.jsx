import logo from './assets/logo.png'
import HomeButton from './components/HomeButton'
import LoginPage from "./pages/Loginpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from './components/layouts/layout';
import MatchingPage from './pages/Matching/MatchingPage';
import MatchingRegister from './pages/Matching/MatchingRegister';
import MatchingDetailPage from './pages/Matching/MatchingDetailPage';
import EditRecruitmentPage from './pages/Matching/EditRecruitmentPage';
import { Signuppage } from './pages/Signuppage';
import { Mainpage } from './pages/Mainpage';
import Home from "./pages/Home";
import UserMatchingPage from './pages/Matching/UserMatchingPage';
import UserDetailPage from './pages/Matching/UserDetailPage';
import UserRegisterPage from './pages/Matching/UserRegisterPage';
import PostManagementPage from './pages/Matching/PostManagementPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<Signuppage/>}/>
        <Route path='/main' element={<Mainpage/>}/>
        <Route path='/recruitments' element={<MatchingPage/>} />
        <Route path='/recruitments/:id' element={<MatchingDetailPage/>} />
        <Route path='/recruitments/:id/edit' element={<EditRecruitmentPage/>} />
        <Route path='/recruitments/new' element={<MatchingRegister/>} />
        <Route path='/users' element={<UserMatchingPage/>}/>
        <Route path='/users/:id' element={<UserDetailPage/>} />
        <Route path='/users/register' element={<UserRegisterPage/>} />
        <Route path='/my-posts' element={<PostManagementPage/>} />
      </Routes>
    </Layout>
  )
}


export default App
