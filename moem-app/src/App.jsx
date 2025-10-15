import HomeButton from './components/HomeButton'
import LoginPage from "./pages/Loginpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { Signuppage } from './pages/Signuppage';
import { Mainpage } from './pages/Mainpage';
import Home from "./pages/Home";
import ProjectFormPage from "./pages/projects/ProjectsFormPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import AiRecommendPage from './pages/matching/AiRecommendPage';

function App() {

  return (
    <>
   
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<Signuppage/>}/>
        <Route path='/main' element={<Mainpage/>}/>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<ProjectFormPage />} />
        <Route path="/projects/:id/edit" element={<ProjectFormPage />} />
        <Route path="/matching/ai-recommend" element={<AiRecommendPage />} />
      </Routes>
    </Router>  
    </>
  );
};

export default App
