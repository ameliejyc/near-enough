import React from "react";
import Big from "big.js";
import "./global.css";

export const GamesList = ({ gamesHistory }) => {
  const reversedGamesHistory = [...gamesHistory].reverse();
  return (
    <ol>
      {reversedGamesHistory.map(
        ({ animal, winnerAccount, winnings, winnerGuess, endTime }) => {
          if (Date.now() < endTime) {
            return <GameListItemInProgress animal={animal} endTime={endTime} winnings={winnings}/>;
          } else
            return (
              <GameListItem
                animal={animal}
                winner={winnerAccount}
                winnings={winnings.transferred}
                guess={Number(winnerGuess) / 1000}
                endTime={endTime}
              />
            );
        }
      )}
    </ol>
  );
};

const GameListItemInProgress = ({ animal, winnings }) => {
  return (
    <li style={{color: "rgb(2, 202, 10)"}}>
      <div>
        <strong>
          Game is in progress! --->
        </strong>
      </div>
      <div>Animal: {animal}</div>
      <div>Current winnings: {(winnings.total / (10**24)).toFixed(1)} Ⓝ</div>
    </li>
  );
};

const GameListItem = ({ animal, winner, winnings, guess, endTime }) => {
  return (
    <li>
      <div>
        <strong>Ended: {new Date(Number(endTime)).toLocaleString()}</strong>
      </div>
      <br />
      <div>Animal: {animal}</div>
      <div>Winning guess: {`${guess} kg` || "No guesses"} </div>
      <div>Winner: {winner || "No winner"}</div>
      <div>Winnings: {(winnings / (10**24)).toFixed(1)} Ⓝ</div>
    </li>
  );
};
