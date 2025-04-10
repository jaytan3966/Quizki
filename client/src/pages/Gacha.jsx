import "./gacha.css";
import ImageSpinner from "../components/ImageSpinner";
import Chatbot from "../components/Chatbot";
import LoginButton from "../components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";

export const Gacha = () => {
  const {user} = useAuth0();
  if (!user)
    return (
  <div className="profileInfo">
    <p>You must be logged in to access the profile page.</p>
    <LoginButton additionalStyles="profile-button" />
  </div>
  );
  return (
    <>
      <div className="gachaContainer">
        <h1>Gacha</h1>
        <h2>100 Points to Play</h2>
        <ImageSpinner />
      </div>
      <Chatbot />
    </>
  );
};
