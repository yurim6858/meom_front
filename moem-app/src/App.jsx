import './App.css'
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layouts/layout';
import MatchingPage from './pages/MatchingPage';
import RecruitmentPage from './pages/RecruitmentPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/matches' element={<MatchingPage/>} />
        <Route path='/recruitments' element={<RecruitmentPage/>} />
      </Routes>
    </Layout>
  )
}

export default App
