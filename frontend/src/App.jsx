import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProjectFindings from './pages/ProjectFindings';
import SeeTheDoctor from './pages/SeeTheDoctor';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ProjectFindings />} />
          <Route path="/doctor" element={<SeeTheDoctor />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
