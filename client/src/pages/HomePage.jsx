import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import { Link } from "react-router-dom";
import "./HomePage.css";
import Chatbot from "../components/Chatbot";

async function getPoints(email) {
  let response = await fetch(`http://localhost:5050/records/users/${email}`);
  const result = await response.json();
  return result[0].points;
}

async function getNumCollected(email) {
  let response = await fetch(`http://localhost:5050/records/users/${email}`);
  const result = await response.json();
  return result[0].collected.length;
}

async function fetchData(email){
  
  // Fetch unlocked Smiskis
  const response = await fetch(
    `http://localhost:5050/records/users/${email}`
  );
  const result = await response.json();
  const smiskisData = (result[0]?.collected || []);
  const uniqueSmiskisData = smiskisData.filter(
    (item, index, self) => index === self.findIndex((t) => t.name === item.name)
  );
  const terms = result[0]?.terms || [];

  const formattedFlashcards = terms.flatMap((languageGroup) => {
    const [type, pairs] = Object.entries(languageGroup)[0];
    return Object.entries(pairs).map(([q, a], i) => ({
      id: `${type}-${i}`,
      question: q,
      answer: a,
      group: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  });
  return [uniqueSmiskisData, formattedFlashcards];

}

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth0();

  const [points, setPoints] = useState(null);
  const [numCollected, setNumCollected] = useState(null);

  const [smiskis, setSmiskis] = useState([]); // State for unlocked Smiskis
  const [flashcards, setFlashcards] = useState([]); // State for flashcards
  
  //fetch profile info
  useEffect(() => {
      
      if (isAuthenticated && user.email) {
        getPoints(user.email).then(
          (fetchedPoints) => {
            setPoints(fetchedPoints);
          }, [isAuthenticated, user]
        );
        getNumCollected(user.email).then(
          (fetchedNumCollected) => {
            setNumCollected(fetchedNumCollected);
          }, [isAuthenticated, user]
        );
      }
    });

  // Fetch Smiskis and Flashcards
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      const fetchUserData = async () => {
        try {
          const [smiskisData, flashcardsData] = await fetchData(user.email);
          setFlashcards(flashcardsData);
          setSmiskis(smiskisData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  if (!user)
    return (
  <div className="profileInfo">
    <p>You must be logged in to access the profile page.</p>
    <LoginButton additionalStyles="profile-button" />
  </div>
  );

  return (
    <div className="home-page">
      {/* Smiskis Collection Preview */}
      <div className="profileInfo">
        <h1>Welcome, {user.email}!</h1>
        <img
          src="../../defaultSmiski.png"
          className="profilePicture"
        ></img>
        <p>Points: {points !== null ? points : "Loading..."}</p>
        <p>
          Smiskis Collected:{" "}
          {numCollected !== null ? numCollected : "Loading..."}
        </p>
        <LogoutButton additionalStyles="profile-button" />
        <Chatbot />
      </div>

      <section className="smiskis-preview">
      <div className="header-container">
        <Link to="/collection">
          See Your Smiskis
          <FaRegArrowAltCircleRight />
        </Link>
      </div>
        <div className="smiskis-grid">
          {smiskis.length > 0 ? (
            smiskis.slice(0, 5).map((smiski, index) => (
              <div key={index} className="smiski-item">
                <img
                  src={`../../${smiski.name}.png`}
                  alt={smiski}
                  className="smiski-image"
                />
                <p>{smiski.name}</p>
              </div>
            ))
          ) : (
            <p>No Smiskis unlocked yet.</p>
          )}
        </div>
      </section>

      {/* Flashcards Preview */}
      <section className="flashcards-preview">
        <div className="header-container">
          <Link to="/flashcards">
            See Your Flashcards
            <FaRegArrowAltCircleRight />
          </Link>
        </div>
        <div className="flashcards-grid">
          {flashcards.length > 0 ? (
            flashcards.slice(0, 5).map((flashcard) => (
              <div key={flashcard.id} className="flashcard-item">
                <p className="flashcard-question">{flashcard.question}</p>
                <p className="flashcard-answer">{flashcard.answer}</p>
              </div>
            ))
          ) : (
            <p>No flashcards available.</p>
          )}
        </div>
      </section>
    </div>
  );
}