import React from "react";
import "./global.css";

export const GamesList = ({ gamesHistory }) => {
  return (
    <ol>
      {gamesHistory.map(
        ({ animal, winnerAccount, winnings, winnerGuess, endTime }) => {
          if (Date.now() < endTime) {
            return <GameListItemInProgress animal={animal} endTime={endTime} />;
          } else
            return (
              <GameListItem
                animal={animal}
                winner={winnerAccount}
                winnings={winnings.transferred}
                guess={winnerGuess}
                endTime={endTime}
              />
            );
        }
      )}
    </ol>
  );
};

const GameListItemInProgress = ({ animal, winnings, endTime }) => {
  return (
    <li>
      <div>
        <strong>
          Current game ends at: {new Date(Number(endTime)).toLocaleString()}
        </strong>
      </div>
      <br />
      <div>Animal: {animal}</div>
      <div>Winnings: {winnings} NEAR</div>
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
      <div>Winning guess: {guess}</div>
      <div>Winner: {winner}</div>
      <div>Winnings: {winnings} NEAR</div>
    </li>
  );
};
