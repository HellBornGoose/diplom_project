import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import RegisterUser from './pages/RegisterUser.jsx';
import LandLordProfile from './pages/LandLordProfileView.jsx'
import UserProfile from './pages/UserProfileView.jsx'
import ProfileUpdateLord from './pages/ProfileUpdateLord.jsx';
import ProfileUpdateUser from './pages/ProfileUpdateUser.jsx';
import RegisterLandLord from './pages/RegisterLandLord.jsx';
import ListingProfile from './pages/ListingProfile.jsx';
import './css/fonts.css';
import ListingCreate from './pages/ListingCreate.jsx';
import AuthRefresh from './Hooks/AuthRefresh.jsx';
import ListingEdit from './pages/ListingEdit.jsx';
import useIsAuthenticated from './Hooks/useIsAuthenticated.jsx';
import Search from './pages/Search.jsx';
import ListingLook from './pages/ListingLook.jsx';



function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Router>
      <AuthRefresh isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerUser" element={<RegisterUser />} />
        <Route path="/registerLord" element={<RegisterLandLord />} />
        

        {/* Защищённые маршруты */}
        
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
