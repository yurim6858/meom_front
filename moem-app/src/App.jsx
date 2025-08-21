import LoginPage from "./pages/Loginpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from './components/layouts/layout';
import MatchingPage from './pages/MatchingPage';
import RecruitmentPage from './pages/RecruitmentPage';
import MatchingDetailPage from './pages/MatchingDetailPage';
import LandingPage from "./pages/LandingPage";
import DashBoard from './pages/DashBoard';
import { SignupPage } from './pages/SignupPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/main' element={<DashBoard/>}/>
        <Route path='/recruitments' element={<MatchingPage/>} />
        <Route path='/recruitments/:id' element={<MatchingDetailPage/>} />
        <Route path='/recruitments/new' element={<RecruitmentPage/>} />
      </Routes>
    </Layout>
  )
}


export default App
