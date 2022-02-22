import "regenerator-runtime/runtime";
import React, { useState } from "react";
import "./global.css";
import { startGame, endGame } from "./services/near";

export const OwnerActions = () => {
  const [index, setIndex] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const handleStartGame = async () => {
    setIsStarting(true);
    try {
      await startGame(parseInt(index));
    } catch (error) {
      console.log(error);
    }
    setIsStarting(false);
  };

  const handleEndGame = async () => {
    setIsEnding(true);
    try {
      await endGame();
    } catch (error) {
      console.log(error);
    }
    setIsEnding(false);
  };

  return (
    <>
      <div>
        <label htmlFor="start-game">
          Pick an animal index to start a new game
        </label>
        <input
          className="animal-input"
          type="number"
          step="1"
          min="0"
          max="8"
          autoComplete="off"
          id="start-game"
          value={index}
          onChange={(e) => {
            setIndex(e.target.value);
          }}
        />
      </div>
      <button style={{ marginBottom: "20px" }} onClick={handleStartGame}>
        {isStarting ? "Starting" : "Start a new game!"}
      </button>
      <button style={{ marginBottom: "20px" }} onClick={handleEndGame}>
        {isEnding ? "Ending" : "End the current game"}
      </button>
    </>
  );
};
