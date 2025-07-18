import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.js';
import RegisterUser from './pages/RegisterUser.js';
import LandLordProfile from './pages/LandLordProfileView.js'
import UserProfile from './pages/UserProfileView.js'
import ProfileUpdate from './pages/ProfileUpdate.js';
import RegisterLandLord from './pages/RegisterLandLord.js';
import ListingProfile from './pages/ListingProfile.js';
import './css/fonts.css';

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
          path="/profile/edit"
          element={<ProfileUpdate />}
        />
          
        <Route path="/" element={<Login />} />
        <Route path="/profile/Lord" element={<LandLordProfile />} />
        <Route path="/profile/User" element= {<UserProfile />} />
        <Route path="/profile/Lord/Listing" element= {<ListingProfile />} />

        {/* Главная или редирект */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
