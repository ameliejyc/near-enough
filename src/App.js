import "regenerator-runtime/runtime";
import React from "react";
import {
  login,
  logout,
  wallet,
  getGamesHistory,
  getCurrentGame,
  accountId,
} from "./services/near";
import "./global.css";
import { GamesList } from "./GamesList";
import { MainContent } from "./MainContent";
import { GameInfo } from "./GameInfo";

import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

export default function App() {
  const [gamesHistory, setGamesHistory] = React.useState([]);
  const [currentGame, setCurrentGame] = React.useState(null);
  const [showMainContent, setShowMainContent] = React.useState(true);

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false);

  const startGame = async () => {
    try {
      startGame();
      console.log("success");
    } catch (e) {
      alert(
        "Something went wrong! " +
          "Maybe you need to sign out and back in? " +
          "Check your browser console for more info."
      );
      throw e;
    }
  };

  React.useEffect(() => {
    const getHistory = async () => {
      try {
        const games = await getGamesHistory();
        setGamesHistory(games);
      } catch (error) {
        console.log(error);
      }
    };
    getHistory();
  }, []);

  React.useEffect(() => {
    getCurrentGame().then((game) => {
      if (Date.now() < game.endTime) {
        setCurrentGame(game);
      } else return;
    });
  }, []);

  return (
    <div className="app-container">
      <div className="games-list-container">
        Games history
        {gamesHistory.length > 0 ? (
          <GamesList gamesHistory={gamesHistory} />
        ) : null}
      </div>
      <div style={{ flexDirection: "column" }}>
        {wallet.isSignedIn() && (
          <button className="link" style={{ float: "right" }} onClick={logout}>
            Sign out
          </button>
        )}
        <div className="main-container">
          {showMainContent ? (
            <MainContent
              currentGame={currentGame}
              gamesHistory={gamesHistory}
            />
          ) : (
            <GameInfo />
          )}
          <button
            className="link"
            onClick={() => setShowMainContent(!showMainContent)}
          >
            {showMainContent ? "What is NEAR enough?" : "Back to the game!"}
          </button>
          {showNotification && <Notification />}
        </div>
      </div>
    </div>
  );
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
  return (
    <aside>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.accountId}`}
      >
        {window.accountId}
      </a>
      {
        " " /* React trims whitespace around tags; insert literal space character when needed */
      }
      called method: 'setGreeting' in contract:{" "}
      <a
        target="_blank"
        rel="noreferrer"
        href={`${urlPrefix}/${window.contract.contractId}`}
      >
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  );
}
