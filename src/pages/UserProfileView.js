import React from "react";
import ProfileInfo from "../components/profileComponents/ProfileInfo";
import Header from "../components/Header";

function UserProfileView(){
return(
    <div>
        
    <Header />
    <h1>Мій профіль</h1>
    <ProfileInfo />
    </div>
)
}

export default UserProfileView;