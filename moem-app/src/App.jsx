import logo from './assets/logo.png'
import HomeButton from './components/HomeButton'
import LoginPage from "./pages/Loginpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Layout from './components/layouts/layout';
import MatchingPage from './pages/MatchingPage';
import RecruitmentPage from './pages/RecruitmentPage';
import MatchingDetailPage from './pages/MatchingDetailPage';
import { Signuppage } from './pages/Signuppage';
import { Mainpage } from './pages/Mainpage';
import Home from "./pages/Home";

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
        <Route path='/recruitments/new' element={<RecruitmentPage/>} />
      </Routes>
    </Layout>
  )
}


export default App
