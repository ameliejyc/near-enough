import "regenerator-runtime/runtime";
import React from "react";
import { login, wallet, accountId } from "./services/near";
import "./global.css";
import { Animal } from "./Animal";

export const MainContent = ({ currentGame, gamesHistory }) => {
  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  console.log(currentGame);

  if (!currentGame)
    return <p>There are no current games in play! Please come back soon :)</p>;

  return (
    <main>
      <h2>Today's animal is</h2>
      <p className="animal-name">{currentGame.animal}</p>
      <div>
        {!wallet.isSignedIn ? (
          <p>
            <button onClick={login}>Sign in to play!</button>
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Animal
              imageUrl={currentGame.imageUrl}
              animal={currentGame.animal}
            />
            <label htmlFor="animal-weight">How much does it weight?</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100000000"
              autoComplete="off"
              id="animal-weight"
              onChange={(e) =>
                setButtonDisabled(e.target.value === gamesHistory)
              }
              style={{ flex: 1 }}
            />
            <span title="NEAR Tokens">Ⓝ</span>
            <button
              disabled={buttonDisabled}
              style={{ borderRadius: "0 5px 5px 0" }}
            >
              Make guess!
            </button>
            {wallet.isSignedIn && <p>You are logged in as {accountId}</p>}
          </div>
        )}
      </div>
    </main>
  );
};
