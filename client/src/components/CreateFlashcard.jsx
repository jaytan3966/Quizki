import React, { useState } from 'react';
import './CreateFlashcard.css'; // Import CSS for styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateFlashcard = ({ addFlashcard }) => {
  // State to store the question input
  const [question, setQuestion] = useState('');
  // State to store the answer input
  const [answer, setAnswer] = useState('');

  const created = (text) => toast.success(`${text}`, {
    style: { background: "#f7d79f", color: "#2d4849" , border: "1px solid #2d4849", fontFamily: "Quicksand, sans-serif"},
    progressStyle: { background: "#2E7D32" },
  });
  const failed = (text) => toast.error(`${text}`, {
    style: { background: "#f7d79f", color: "#2d4849" , border: "1px solid #2d4849", fontFamily: "Quicksand, sans-serif"},
    progressStyle: { background: "#2E7D32" },
  });
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (question.trim() && answer.trim()) {
      // If both fields are filled, add the flashcard
      created("Flashcard created successfully!");
      addFlashcard(question, answer);
      setQuestion(''); // Clear the question input field
      setAnswer(''); // Clear the answer input field
      setCurrentPage("choose");
      return;
    } else {
      // Alert the user if either field is empty
      failed("Please fill in both fields.");
    }
  };

  return (
    <div className="create-flashcard">
      <h2>Create Flashcard</h2>
      {/* Form to create a new flashcard */}
      <form>
        <div>
          {/* Input field for the question */}
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)} // Update the question state
            placeholder='Enter a term'
          />
        </div>
        <div>
          {/* Input field for the answer */}
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)} // Update the answer state
            placeholder='Enter the answer'
          />
        </div>
        {/* Button to submit the form */}
        <button type="submit" onClick={handleSubmit} className='create-flashcard-button'>Add Flashcard</button>
      </form>
    </div>
  );
};

export default CreateFlashcard;