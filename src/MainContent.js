import "regenerator-runtime/runtime";
import React, { useState } from "react";
import { login, wallet, accountId, makeGuess } from "./services/near";
import "./global.css";
import { Animal } from "./Animal";

export const MainContent = ({ currentGame }) => {
  const [guess, setGuess] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  if (!currentGame)
    return <p>There are no current games in play! Please come back soon :)</p>;

  const handleSubmitGuess = async () => {
    setIsSubmitting(true);
    setButtonDisabled(true);
    try {
      await makeGuess(Math.round(guess * 1000));
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
    setGuess(0);
  };

  return (
    <main>
      <h2>Today's game is</h2>
      <p className="animal-name">{currentGame.animal}</p>
      <p style={{ fontSize: "medium", marginTop: 0 }}>
        Ends at {new Date(Number(currentGame.endTime)).toLocaleString()}
      </p>
      <>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Animal imageUrl={currentGame.imageUrl} animal={currentGame.animal} />
          {!wallet.isSignedIn() ? (
            <p>
              <button onClick={login}>Sign in to play!</button>
            </p>
          ) : (
            <>
              <div className="animal-input-container">
                <label htmlFor="animal-weight">
                  How much does this {currentGame.animal} weigh?
                </label>
                <input
                  className="animal-input"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100000000"
                  autoComplete="off"
                  id="animal-weight"
                  value={guess}
                  onChange={(e) => {
                    setGuess(e.target.value);
                    setButtonDisabled(guess === 0 || guess === 100000000);
                  }}
                />
                <span>kg</span>
              </div>
              <button
                disabled={buttonDisabled}
                style={{ marginBottom: "20px" }}
                onClick={handleSubmitGuess}
              >
                {isSubmitting ? "Submitting" : "Make a guess!"}
              </button>
              <span
                style={{ fontSize: "medium", marginBottom: "20px" }}
                title="Each transaction costs 0.1 NEAR Tokens"
              >
                Each guess requires a 0.1 Ⓝ deposit.
                {wallet.isSignedIn && (
                  <span> You are logged in as {accountId}.</span>
                )}
              </span>
            </>
          )}
        </div>
      </>
    </main>
  );
};
