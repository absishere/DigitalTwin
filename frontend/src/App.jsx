import { Routes, Route, Navigate } from 'react-router-dom';
import LiveMap from './pages/LiveMap';
import Login from './pages/Login';
import Register from './pages/Register';

// Simple mock auth check
function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('marineverse_auth') === 'true';
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <LiveMap />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
