import './App.css'
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layouts/layout';
import MatchingPage from './pages/MatchingPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<MatchingPage/>} />
      </Routes>
    </Layout>
  )
}

export default App
