import { Context, logging, u128 } from "near-sdk-as";
import { Game, games, Guess, guesses } from "./model";
import { ONE_NEAR } from "../../utils";

const GAMES_LIMIT = 10;
// max 5 NEAR accepted to this contract before it forces a transfer to the owner
const CONTRIBUTION_SAFETY_LIMIT: u128 = u128.mul(ONE_NEAR, u128.from(5));

/**
 * Starts a new game. Currently this method has to be invoked manually but could be automated in future.
 * NOTE: This is a change method. It will modify state.
 */
export function startGame(animalIndex: i32, timestamp: u64): void {
  assertOwner();
  // Create a new game and populate fields with our data
  const game = new Game(animalIndex, timestamp);
  // Add the game to end of the persistent collection
  games.push(game);
  logging.log(
    `New game started: Animal is ${game.animal}, ending at ${game.endTime}`
  );
}

/**
 * Deletes the current game.
 * NOTE: This is a change method. It will modify state.
 */
export function deleteCurrentGame(): void {
  assertOwner();
  // Remove the last game from the persistent collection
  games.pop();
}

/**
 * Adds a guess to the current game's guesses.
 * NOTE: This is a change method. Which means it will modify the state.
 */
export function makeGuess(value: number, timestamp: u64): void {
  // pass in u64 Date value and then call new Date(value).now() https://www.assemblyscript.org/stdlib/date.html
  // const timeNow = new Date(timestamp);
  const currentGame = games[games.length - 1];
  // assert(timeNow <= currentGame.endTime, "Sorry you're too late"); // uncomment when endTime is fixed
  // Guard against too much money being deposited to this account in beta
  const deposit = Context.attachedDeposit;
  assertFinancialSafety(deposit);
  // Add to separate contribution tracker?

  // Create a new guess and populate guess value
  const guess = new Guess(value);
  // Add the guess to end of the persistent collection
  guesses.push(guess);
}

/**
 * Gets the historical list of games.
 * NOTE: This is a view method. It will not modify state.
 */
export function getGamesHistory(): Game[] {
  const numGames = min(GAMES_LIMIT, games.length);
  const startIndex = games.length - numGames;
  const result = new Array<Game>(numGames);
  for (let i = 0; i < numGames; i++) {
    result[i] = games[i + startIndex];
  }
  return result;
}

/**
 * Ends the current game and calculates the winner.
 * Currently this method has to be invoked manually but could be automated in future.
 * NOTE: This is a change method. Which means it will modify the state.
 */
export function endGame(): void {
  assertOwner();
  setWinner();
}

function sendWinnerWinnings(): void {
  assertOwner();
  // Assert funds are above zero

  // const to_self = Context.contractName;
  // const to_owner = ContractPromiseBatch.create(this.owner);

  // // transfer earnings to owner then confirm transfer complete
  // const promise = to_owner.transfer(this.contributions.received);
  // promise
  //   .then(to_self)
  //   .function_call("onTransferComplete", "{}", u128.Zero, XCC_GAS);
}

// function onTransferComplete(): void {
//   assertOwner();
//   assert_single_promise_success();

//   logging.log("transfer complete");
//   // reset contribution tracker
//   this.contributions.record_transfer();
// }

function assertFinancialSafety(deposit: u128): void {
  //   const new_total = u128.add(deposit, this.contributions.received);
  //   assert(
  //     u128.le(deposit, CONTRIBUTION_SAFETY_LIMIT),
  //     "You are trying to attach too many NEAR Tokens to this call.  There is a safe limit while in beta of 5 NEAR"
  //   );
  //   assert(
  //     u128.le(new_total, CONTRIBUTION_SAFETY_LIMIT),
  //     "Maximum contributions reached.  Please call transfer() to continue receiving funds."
  //   );
}

/***********************************************
 * Internal methods
 ************************************************/

/**
 * Internal method to calculate and set the winner on to the current Game.
 */
function setWinner(): void {
  const numberOfGuesses: number = guesses.length;
  // if there were no guesses, return early
  if (numberOfGuesses < 1) return;
  let guessTotal: number = 0;
  for (let a = 0; a < numberOfGuesses; a++) {
    guessTotal += guesses[a].guess;
  }
  const guessAverage = guessTotal / numberOfGuesses;
  // TODO: figure out closest guess
  const winner = guesses[0]; // just set the first guess for now
  const currentGameIndex = games.length - 1;
  const currentGame = games[currentGameIndex];
  currentGame.setWinner(winner);
  games.replace(currentGameIndex, currentGame);
  sendWinnerWinnings();
}

function assertOwner(): void {
  const caller = Context.predecessor;
  const owner = Context.contractName;
  assert(
    owner == caller,
    "Only the owner of this contract may call this method"
  );
}
