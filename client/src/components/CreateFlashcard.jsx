import React, { useState } from 'react';
import './CreateFlashcard.css'; // Import CSS for styling
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateFlashcard = ({ addFlashcard }) => {
  // State to store the question input
  const [question, setQuestion] = useState('');
  // State to store the answer input
  const [answer, setAnswer] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (question.trim() && answer.trim()) {
      // If both fields are filled, add the flashcard
      addFlashcard(question, answer);
      setQuestion(''); // Clear the question input field
      setAnswer(''); // Clear the answer input field
      created();
    } else {
      // Alert the user if either field is empty
      failed();
    }
  };

  const created = () => toast.success("Flashcard created!", {
    style: { background: "#f7d79f", color: "#2d4849" , border: "1px solid #2d4849", "font-family": "Quicksand, sans-serif"},
    progressStyle: { background: "#2E7D32" },
  });
  const failed = () => toast.error("Failed to create flashcard. Please try again.", {
    style: { background: "#f7d79f", color: "#2d4849" , border: "1px solid #2d4849", "font-family": "Quicksand, sans-serif"},
    progressStyle: { background: "#2E7D32" },
  });

  return (
    <div className="create-flashcard">
      <h2>Create Flashcard</h2>
      {/* Form to create a new flashcard */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question: </label>
          {/* Input field for the question */}
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)} // Update the question state
          />
        </div>
        <div>
          <label>Answer: </label>
          {/* Input field for the answer */}
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)} // Update the answer state
          />
        </div>
        {/* Button to submit the form */}
        <button type="submit" className='create-flashcard-button'>Add Flashcard</button>
        <ToastContainer position="bottom-left" autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'/>
      </form>
    </div>
  );
};

export default CreateFlashcard;
