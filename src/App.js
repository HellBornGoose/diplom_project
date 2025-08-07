import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.js';
import RegisterUser from './pages/RegisterUser.js';
import LandLordProfile from './pages/LandLordProfileView.js'
import UserProfile from './pages/UserProfileView.js'
import ProfileUpdateLord from './pages/ProfileUpdateLord.js';
import ProfileUpdateUser from './pages/ProfileUpdateUser.js';
import RegisterLandLord from './pages/RegisterLandLord.js';
import ListingProfile from './pages/ListingProfile.js';
import './css/fonts.css';
import ListingCreate from './pages/ListingCreate.js';
import AuthRefresh from './Hooks/AuthRefresh.js';
import ListingEdit from './pages/ListingEdit.js';
import useIsAuthenticated from './Hooks/useIsAuthenticated.js';
import Search from './pages/Search.js';
import ListingLook from './pages/ListingLook.js';



function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Router>
      <AuthRefresh isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerLord" element={<RegisterLandLord />} />
        

        {/* Защищённые маршруты */}
        
          
        <Route path="/" element={<Login />} />
        <Route path="/profile/Lord" element={<LandLordProfile />} />
        <Route path="/profile/Lord/edit" element={<ProfileUpdateLord />} />
        <Route path="/profile/User" element={<UserProfile />} />
        <Route path="/profile/User/edit" element={<ProfileUpdateUser />} />
        <Route path="/profile/Lord/Listing" element= {<ListingProfile />} />
        <Route path="/listing/create" element= {<ListingCreate />} />
        <Route path="/listing/edit/:listingId" element={ <ListingEdit/> } />
        <Route path="/listing/search" element={ <Search/> } />
        <Route path="/listing/search/:listingId" element={<ListingLook />} />

        {/* Главная или редирект */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
