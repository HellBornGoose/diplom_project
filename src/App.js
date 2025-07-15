import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.js';
import RegisterUser from './pages/RegisterUser.js';
import LandLordProfile from './pages/LandLordProfileView.js'
import UserProfile from './pages/UserProfileView.js'
import ProfileUpdate from './pages/ProfileUpdate.js';
import RegisterLandLord from './pages/RegisterLandLord.js';

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('jwtToken')); // простой пример авторизации


  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerLord" element={<RegisterLandLord />} />
        

        {/* Защищённые маршруты */}
        <Route
          path="/profile/edit" element={<ProfileUpdate /> } />
          
        <Route path="/" element={<Login />} />
        <Route path="/profile/landlord" element={isAuthenticated ? <LandLordProfile /> : <Navigate to="/login" replace />} />
        <Route path="/profile/user" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" replace />} />

        {/* Главная или редирект */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
