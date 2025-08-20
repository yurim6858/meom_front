import './App.css'
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layouts/layout';
import MatchingPage from './pages/MatchingPage';
import RecruitmentPage from './pages/RecruitmentPage';
import MatchingDetailPage from './pages/MatchingDetailPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/recruitments' element={<MatchingPage/>} />
        <Route path='/recruitments/:id' element={<MatchingDetailPage/>} />
        <Route path='/recruitments/new' element={<RecruitmentPage/>} />
      </Routes>
    </Layout>
  )
}

export default App
