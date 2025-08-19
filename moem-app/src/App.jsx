import logo from './assets/logo.png'
import HomeButton from './components/HomeButton'
import LoginPage from "./pages/Loginpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { Signuppage } from './pages/Signuppage';

function App() {

  return (
    <>
    <Router>
      <div className='header-container'>
        <img src={logo} className="logo-img"/>
        <div >
        <HomeButton/>
        </div>
      </div>
      
      
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<Signuppage/>}/>
      </Routes>
    </Router>
        
      
    </>
  );
};

export default App
