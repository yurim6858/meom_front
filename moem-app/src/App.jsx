import logo from './assets/logo.png'
import HomeButton from './components/HomeButton'
import './App.css'

function App() {

  return (
    <>
      <div className='header-container'>
        <img src={logo} className="logo-img"/>
        <div >
        <HomeButton/>
        </div>
      </div>
      
    </>
  );
};

export default App
