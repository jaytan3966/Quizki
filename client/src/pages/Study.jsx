import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Study.css";
import LoginButton from "../components/LoginButton";
import Chatbot from "../components/Chatbot";

import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Study() {
  const [terms, setTerms] = useState([]); // All terms fetched from the backend
  const [groupedTerms, setGroupedTerms] = useState({}); // Terms grouped by language (only non-empty groups)
  const [selectedGroup, setSelectedGroup] = useState(null); // Selected group for the test
  const [answers, setAnswers] = useState({}); // User answers
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();


  const notification = (text, success) => {
    if (success === "100") {
      toast.success(`${text}`, {
        position: "bottom-left",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { 
          background: "#f7d79f", 
          color: "#2d4849",
          border: "1px solid #2d4849", 
          fontFamily: "Quicksand, sans-serif"
        },
      });
    } else if (success === "missed"){
      toast.warning(`${text}`, {
        position: "bottom-left",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { 
          background: "#f7d79f", 
          color: "#2d4849",
          border: "1px solid #2d4849", 
          fontFamily: "Quicksand, sans-serif"
        },
      });
    } else {
      toast.error(`${text}`, {
        position: "bottom-left",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: { 
          background: "#f7d79f", 
          color: "#2d4849",
          border: "1px solid #2d4849", 
          fontFamily: "Quicksand, sans-serif"
        },
      });
    }
  };
  // Fetch terms from the backend and filter out empty groups
  async function fetchTerms() {
    try {
      const response = await fetch(
        `http://localhost:5050/records/users/${user.email}`
      );
      const result = await response.json();
      const userTerms = result[0]?.terms || [];

      const grouped = {};
      const initialAnswers = {};

      userTerms.forEach((languageObj) => {
        Object.entries(languageObj).forEach(([language, terms]) => {
          // Only create group if there are terms
          if (terms && Object.keys(terms).length > 0) {
            grouped[language] = grouped[language] || [];
            Object.entries(terms).forEach(([term, translation]) => {
              const termObj = {
                id: `${language}-${term}`, // Unique ID
                language,
                term,
                translation,
              };
              grouped[language].push(termObj);
              initialAnswers[`${language}-${term}`] = ""; // Initialize answers
            });
          }
        });
      });

      setTerms(userTerms);
      setGroupedTerms(grouped);
      setAnswers(initialAnswers);
    } catch (error) {
      console.error("Error fetching terms:", error);
    }
  }

  // Handle answer input changes
  const handleAnswerChange = (termId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [termId]: value,
    }));
  };

  // Handle test submission
  const handleSubmit = () => {
    let correct = 0;
    const selectedTerms = groupedTerms[selectedGroup] || [];

    selectedTerms.forEach((term) => {
      if (answers[term.id]?.toLowerCase() === term.translation.toLowerCase()) {
        correct++;
      }
    });

    const score = Math.round((correct / selectedTerms.length) * 100);
    if (score === 0) {
      notification("You scored 0%. Better luck next time!", "cooked");
    } else if (score === 100){
      notification("Perfect score! You got 100%!", "100");
    } else {
      notification(`You scored ${score}% (${correct} out of ${selectedTerms.length})`, "missed");
    }

    if (score === 100) {
      // Award points for a perfect score
      fetch(`http://localhost:5050/records/balance/${user.email}/100`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTimeout(() => {
        notification("Congratulations! You've earned 100 points for a perfect score!", "100");
      }, 1000);
    }
    setTimeout(() => {
      navigate("/");
    }, 4000);
  };

  // Fetch terms when the user logs in
  useEffect(() => {
    if (user) {
      fetchTerms();
    }
  }, [user]);

  if (isLoading) return <div className="loading">Loading...</div>;

  if (!user)
    return (
      <div className="profileInfo">
        <p>You must be logged in to access the profile page.</p>
        <LoginButton additionalStyles="profile-button" />
      </div>
    );

  if (Object.keys(groupedTerms).length === 0) {
    return (
      <div className="no-groups">
        <p>
          No terms available for study. Please add some flashcards to get
          started!
        </p>
        <button
          onClick={() => navigate("/create")}
          className="edit-flashcards-button"
        >
          Edit Flashcards
        </button>
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="study-page">
      {!selectedGroup ? (
        <div className="test-page">
          <h2>Select a Group to Start the Test</h2>
          <div className="group-buttons">
            {Object.keys(groupedTerms).map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className="group-button"
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="test-page">
          <h2>Practice Test: {selectedGroup}</h2>
          <div className="test-container">
          
            <div className="questions-container">
              {groupedTerms[selectedGroup].map((term, index) => (
                <div key={term.id} className="question-row">
                  <div className="question-number">
                    <h2>{index + 1}.</h2>
                  </div>
                  <div className="question-content">
                    <p>{term.term}</p>
                    <input
                      type="text"
                      value={answers[term.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(term.id, e.target.value)
                      }
                      placeholder="Your answer..."
                      className="answer-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="test-buttons">
          <button className="submit-button" onClick={handleSubmit}>
            Submit Answers
          </button>
          <button
            className="back-button"
            onClick={() => setSelectedGroup(null)}
          >
            Back to Group Selection
          </button>
        </div>
      </div>
      )}
      <ToastContainer position="bottom-left" autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme='light'/>
    </div>
  );
}