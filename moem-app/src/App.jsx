import logo from './assets/logo.png'
import HomeButton from './components/HomeButton'
import LoginPage from "./pages/Loginpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { Signuppage } from './pages/Signuppage';
import Home from "./pages/Home";

function App() {

  return (
    <>
   
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<Signuppage/>}/>
      </Routes>
    </Router>  
    </>
  );
};

export default App
