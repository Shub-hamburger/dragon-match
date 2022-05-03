import { useState, useEffect, useCallback } from "react";
import Card from "./components/Card/Card";
import Confetti from "react-confetti";

import "./App.css";

const cardImages = [
  { src: "/img/one_star.png", matched: false },
  { src: "/img/two_star.png", matched: false },
  { src: "/img/three_star.png", matched: false },
  { src: "/img/four_star.png", matched: false },
  { src: "/img/five_star.png", matched: false },
  { src: "/img/six_star.png", matched: false },
];

function App() {
  const [won, setWon] = useState(false);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [best, setBest] = useState(() => localStorage.getItem("best") || 0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        id: Math.random(),
      }));

    setWon(false);
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const handleFlip = (card) => {
    return card === choiceOne || card === choiceTwo || card.matched;
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // update best
  const updateBest = useCallback(() => {
    if (turns === 0) return;
    if (+best !== 0 && turns < +best) {
      setBest(turns);
    } else if (+best === 0) {
      setBest(turns);
    }
  }, [turns, best]);

  useEffect(() => {
    localStorage.setItem("best", best);
    console.log(localStorage.getItem("best"));
  }, [best]);

  useEffect(() => {
    const allSameValue = cards.every((card) => card.matched === true);
    if (allSameValue) {
      setWon(true);
      updateBest();
    }
  }, [cards, updateBest]);

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      {won && <Confetti />}
      <h1>Dragon Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            src={card.src}
            disabled={disabled}
            flipped={handleFlip(card)}
            handleChoice={() => handleChoice(card)}
          />
        ))}
      </div>
      <span className="turns">Turns: {turns}</span>
      <span>Best: {best}</span>
    </div>
  );
}

export default App;
