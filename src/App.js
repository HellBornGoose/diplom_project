import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.js';
import RegisterUser from './pages/RegisterUser.js';
import LandLordProfile from './pages/LandLordProfileView.js'
import UserProfile from './pages/UserProfileView.js'
import ProfileUpdate from './pages/ProfileUpdate.js';
import RegisterLandLord from './pages/RegisterLandLord.js';
import ListingProfile from './pages/ListingProfile.js';
import './css/fonts.css';
import ListingCreate from './pages/ListingCreate.js';
import AuthRefresher from './Hooks/AuthRefresh.js';
import ListingEdit from './pages/ListingEdit.js';
import useIsAuthenticated from './Hooks/useIsAuthenticated.js';

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Router>
      <AuthRefresher isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerLord" element={<RegisterLandLord />} />
        

        {/* Защищённые маршруты */}
        <Route
          path="/profile/edit"
          element={isAuthenticated ? <ProfileUpdate /> : <Navigate to="/login" replace />}
        />
          
        <Route path="/" element={<Login />} />
        <Route path="/profile/Lord" element={<LandLordProfile />} />
        <Route path="/profile/User" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" replace />} />
        <Route path="/profile/Lord/Listing" element= {<ListingProfile />} />
        <Route path="/listing/create" element= {<ListingCreate />} />
        <Route path="/listing/edit/:listingId" element={ <ListingEdit/> } />

        {/* Главная или редирект */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
