import React from "react";

import "./Card.css";

function Card({ src, handleChoice, disabled, flipped }) {
  const handleClick = () => {
    !disabled && handleChoice();
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : ""}>
        <img className="front" src={src} alt="card front" />
        <img
          className="back"
          src="/img/kaio_sama.png"
          onClick={handleClick}
          alt="card back"
        />
      </div>
    </div>
  );
}

export default Card;
