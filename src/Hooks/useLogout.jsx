import { useNavigate } from "react-router-dom";

function logout (){
    const navigate = useNavigate;


    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpires");

    navigate("/login");
}