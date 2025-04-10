import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

// Flashcards data

export async function SAMPLE_FLASHCARD(){
  const { user } = useAuth0();
  let response = await fetch(`https://localhost:5050/records/users/${user.email}`);
  const result = await response.json();
  let terms = result[0].terms;

  let ans = [];
  const formatted = terms.flatMap(languageGroup => {
    const [type, pairs] = Object.entries(languageGroup)[0];
    return Object.entries(pairs).map(([q, a], i) => ({
      id: `${type}-${i}`,
      question: q,
      answer: a,
      group: type.charAt(0).toUpperCase() + type.slice(1)
    }));
  });
  return ans;
}

const Flashcard = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div className={`card ${isFlipped ? 'flip' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className="front">{flashcard.question}</div>
      <div className="back">{flashcard.answer}</div>
    </div>
  );
};

export default Flashcard;