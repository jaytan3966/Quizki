import React from "react";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="title">
        Website Name TBD
      </Link>
      <ul>
        <li>
          <Link to="/study">Study</Link>
        </li>
        <li>
          <Link to="/flashcards">My Flashcards</Link>
        </li>
        <li>
          <Link to="/create">Create Flashcards</Link>
        </li>

        <li>
          <Link to="/collection">Collection</Link>
        </li>
        <li>
          <Link to="/gacha">Gacha</Link>
        </li>
        <li>
          <Link to="/profile">
            <CgProfile className="profileIcon" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};
