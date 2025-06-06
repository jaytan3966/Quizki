import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Flashcard from './Flashcarddata.jsx';
import './FlashCardList.css'
import { useNavigate } from 'react-router-dom';

export default function FlashcardList() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [SAMPLE_FLASHCARDS, setFlashcards] = useState([]);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const { user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
      setIsFlipped(false);
    }, [currentFlashcardIndex]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`http://localhost:5050/records/users/${user.email}`);
        const result = await response.json();
        const terms = result[0]?.terms || [];
        
        const formatted = terms.flatMap(languageGroup => {
          const [type, pairs] = Object.entries(languageGroup)[0];
          return Object.entries(pairs).map(([q, a], i) => ({
            id: `${type}-${i}`,
            question: q,
            answer: a,
            group: type.charAt(0).toUpperCase() + type.slice(1)
          }));
        });
        
        setFlashcards(formatted);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user?.email]);

  const groups = [...new Set(SAMPLE_FLASHCARDS.map((flashcard) => flashcard.group))];
  const filteredFlashcards = selectedGroup 
    ? SAMPLE_FLASHCARDS.filter((flashcard) => flashcard.group === selectedGroup)
    : [];

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setCurrentFlashcardIndex(0);
  };

  const handleNextFlashcard = () => {
    setCurrentFlashcardIndex((prevIndex) => (prevIndex + 1) % filteredFlashcards.length);
  };

  const handlePreviousFlashcard = () => {
    setCurrentFlashcardIndex((prevIndex) =>
      prevIndex === 0 ? filteredFlashcards.length - 1 : prevIndex - 1
    );
  };

  if (loading) return <div>Loading flashcards...</div>;

  return (
    <div className='flashcard-list'>
      
      {!selectedGroup ? (
        <div className="flashcard-groups">
          <h2>Your Flashcard Groups</h2>
          <div className="group-buttons">
            {groups.map((group) => (
              <button

                key={group}
                onClick={() => handleGroupClick(group)}
              >
                {group}
              </button>
            ))}
          </div>
          <div className="navigation-buttons">
            <button className="prev-button" onClick={() => navigate("/create")}>
                Edit Cards
            </button>
          </div>
        </div>
      ) : filteredFlashcards.length > 0 ? (
        <div>
          <h2>{selectedGroup} Flashcards</h2>

          <div className="flashcard-container">
            <Flashcard flashcard={filteredFlashcards[currentFlashcardIndex]} isFlipped={isFlipped}
  setIsFlipped={setIsFlipped}/>
          </div>

          <div className="navigation-buttons">
            <button onClick={handlePreviousFlashcard} className="prev-button">
              Previous
            </button>
            <button onClick={() => setSelectedGroup(null)} className="back-button">
              Back to Groups
            </button>
            <button onClick={handleNextFlashcard} className="next-button">
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No flashcards available for this group.</p>
      )}
    </div>
  );
}