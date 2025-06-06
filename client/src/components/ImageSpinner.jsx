import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion"; // Import Framer Motion
import "./ImageSpinner.css";

import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

async function getPoints(email) {
  let response = await fetch(`http://localhost:5050/records/users/${email}`);
  const result = await response.json();
  return result[0].points;
}

function ImageSpinner() {
  const location = useLocation();
  const images = ["Bath", "Sunday", "Toilet", "Work"];
  const intervals = [3000, 4000, 5000, 6000];
  const smiskis = {
    Bath: [
      "Shampoo",
      "Not_Looking",
      "Scrubbing",
      "With_Duck",
      "Dazed",
      "Looking",
    ],
    Toilet: [
      "Peek-A-Boo",
      "Little_(Smelly)",
      "Squatting",
      "Helping_Out",
      "Resting",
      "Holding_In",
    ],
    Sunday: [
      "Blowing_Bubbles",
      "Paper_Airplane",
      "Sunbathing",
      "Sing-Along",
      "Skateboarding",
      "Gardening",
    ],
    Work: [
      "Approving",
      "Researching",
      "Presenting",
      "Good_Idea",
      "On_the_Rord",
      "Group_Think",
    ],
    Exercising: ["Crunches", "Stretching", "Dumbbell", "Balance", "Aerobics", "Hoop"],
  };

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [spinning, setSpinning] = useState(false);
  const [smiski, setSmiski] = useState();
  const [smiskiIndex, setSmiskiIndex] = useState(null);
  const [points, setPoints] = useState(0);
  const { isAuthenticated, user } = useAuth0();
  const showSuccessNotification = () => {
    toast.success(`Added to your collection!`, {
      position: "bottom-left",
      autoClose: 5000,
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
  };

  const resetState = () => {
    setCurrentImage(images[0]);
    setSpinning(false);
    setSmiski(null);
  };

  useEffect(() => {
    resetState();
  }, [location.pathname]);

  useEffect(() => {
    function handlePageShow(event) {
      if (event.persisted) {
        resetState();
      }
    }

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  useEffect(() => {
    if (currentImage) {
      const series = smiskis[currentImage];
      setSmiskiIndex(Math.floor(Math.random() * series.length));
    }
  }, [currentImage]);

  const addSmiski = async (email, smiskiName) => {
    try {
      const response = await fetch(
        `http://localhost:5050/records/smiskis/${email}/${smiskiName}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error calling patch route: ", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      getPoints(user.email).then(
        (fetchedPoints) => {
          setPoints(fetchedPoints);
        },
        [isAuthenticated, user]
      );
    }
  }, [getPoints(user.email)]);

  const cycleImage = () => {
    if (spinning) {
      return;
    }

    if (points < 100) {
      alert("You need at least 100 points to open a new blind box.");
      return;
    }

    setSpinning(true);

    const randomIntervalIndex = Math.floor(Math.random() * intervals.length);
    const duration = intervals[randomIntervalIndex];
    const intervalTime = 150;
    let elapsed = 0;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[randomIndex]);
      elapsed += intervalTime;

      if (elapsed >= duration) {
        clearInterval(interval);
        setSpinning(false);

        const finalImage = images[randomIndex];
        const series = smiskis[finalImage];
        const randomSmiskiIndex = Math.floor(Math.random() * series.length);
        const finalSmiski = series[randomSmiskiIndex];
        setSmiski(finalSmiski);

        if (isAuthenticated && user?.email) {
          addSmiski(user.email, finalSmiski);
          setTimeout(() => {
            showSuccessNotification();
          }, 2000);
        }
      }
    }, intervalTime);

    setSmiski(smiskis[smiskiIndex]);
  };

  return (
    <div className="spinnerContainer">
      <h2 className="counter">
        Your Points: {points !== null ? points : "Loading..."}
      </h2>
      <img src={`../../${currentImage}.png`} className="smiskiBox"></img>
      <button onClick={cycleImage} disabled={spinning} className="spinnerContainer-button">
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {smiski && !spinning && (
        <motion.div
          className="smiski-popup"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={`/${smiski}.png`}
            alt={`Smiski ${smiski}`}
            className="smiski-image"
            onError={(e) => {
              e.target.src = "/defaultSmiski.png"; // Fallback image
            }}
          />
          <p>Congrats! You got Smiski {smiski.replace(/_/g, " ")} from the {currentImage} series!</p>
        </motion.div>
      )}
      <ToastContainer position="bottom-left" autoClose={3000}
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

export default ImageSpinner;
