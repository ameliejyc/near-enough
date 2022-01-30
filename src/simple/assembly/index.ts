import { Context, logging, u128, ContractPromiseBatch } from "near-sdk-as";
import { Game, games, Guess, guesses } from "./model";
import { ONE_NEAR, assert_single_promise_success, XCC_GAS } from "../../utils";

const GAMES_LIMIT = 10;
// max 5 NEAR accepted to this contract
export const MAXIMUM_PAY_TO_PLAY: u128 = u128.mul(ONE_NEAR, u128.from(5));
export const PAY_TO_PLAY: u128 = u128.div10(ONE_NEAR);

/**
 * Starts a new game. Currently this method has to be invoked manually but could be automated in future.
 * NOTE: This is a change method. It will modify state.
 */
export function startGame(animalIndex: i32, timestamp: u64): void {
  assertOwner();
  if (games.length > 0) {
    const timeNow = <u64>new Date(timestamp).getTime();
    const previousGame = games[games.length - 1];
    assert(
      timeNow > previousGame.endTime,
      "There's already a game in progress"
    );
  }
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
export function makeGuess(value: f32, timestamp: u64): void {
  // Check there is a game available
  assert(games.length > 0, "There are no games available");

  // Check the attached deposit is at least the minimum
  const deposit = Context.attachedDeposit;
  assert(
    u128.ge(deposit, PAY_TO_PLAY),
    "Please contribute at least 0.1 NEAR to play!"
  );

  // Check the time of play is within the game time
  const timeNow = <u64>new Date(timestamp).getTime();
  const currentGame = games[games.length - 1];
  assert(
    timeNow <= currentGame.endTime,
    "Sorry you're too late to guess in this game"
  );

  // Check the guess value is within bounds
  assert(0 < value, "Guess value is not within range");
  assert(value < 1000000, "Guess value is not within range");

  // Guard against too much money being deposited to this account in beta
  assertFinancialSafety(deposit);
  if (deposit > u128.Zero) {
    currentGame.winnings.update(deposit);
  }

  // Create a new guess and populate guess value
  const guess = new Guess(value);
  // Add the guess to end of the guesses persistent collection
  guesses.push(guess);
  // Update the current Game in the games persistent collection
  games.replace(games.length - 1, currentGame);
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
 * Gets the current game guesses.
 * NOTE: This is a view method. It will not modify state.
 */
export function getGuesses(): Guess[] {
  assertOwner();
  if (guesses.length < 1) return [];
  const numGuesses = guesses.length - 1;
  const result = new Array<Guess>(numGuesses);
  for (let i = 0; i < numGuesses; i++) {
    result[i] = guesses[i];
  }
  return result;
}

/**
 * Gets the current game winnings.
 * NOTE: This is a view method. It will not modify state.
 */
export function getWinnings(): u128 {
  return getCurrentGame().winnings.total;
}

/**
 * Ends the current game and calculates the winner. Then deletes guesses.
 * Currently this method has to be invoked manually but could be automated in future.
 * NOTE: This is a change method. Which means it will modify the state.
 */
export function endGame(): void {
  assertOwner();
  setWinner();
  deleteGuesses();
}

/**
 * Deletes guesses from persistent storage.
 */
export function deleteGuesses(): void {
  assertOwner();
  // If there were no guesses, return early
  if (guesses.length < 1) return;
  while (guesses.length > 0) {
    guesses.pop();
  }
}

/***********************************************
 * Internal methods
 ************************************************/

/**
 * Calculates winner and updates the game. Calls function to transfer winnings.
 */
function setWinner(): void {
  assertOwner();
  const numberOfGuesses: number = guesses.length;
  // If there were no guesses, return early
  if (numberOfGuesses < 1) return;
  let guessTotal: number = 0;
  for (let a = 0; a < numberOfGuesses; a++) {
    guessTotal += guesses[a].guess;
  }
  const guessAverage = guessTotal / numberOfGuesses;
  // TODO: figure out closest guess
  const winner = guesses[0]; // just set the first guess for now
  getCurrentGame().setWinner(winner);
  sendWinnerWinnings();
}

/**
 * Transfers winnings to the winner and updates the game.
 */
function sendWinnerWinnings(): void {
  assertOwner();
  const currentGame = getCurrentGame();
  const currentGameIndex = games.length - 1;
  assert(
    currentGame.winnings.total > u128.Zero,
    "No winnings to be transferred"
  );

  // Transfer earnings to owner then confirm transfer complete
  const toWinner = ContractPromiseBatch.create(currentGame.winnerAccount);
  const promise = toWinner.transfer(currentGame.winnings.total);
  promise
    .then(Context.contractName)
    .function_call("onTransferComplete", "{}", u128.Zero, XCC_GAS);

  // Replace the current game with the updated game
  games.replace(currentGameIndex, currentGame);
}

function onTransferComplete(): void {
  assertOwner();
  assert_single_promise_success();
  logging.log("Transfer to winner is complete");

  // Reset winnings tracker
  getCurrentGame().winnings.recordTransfer();
}

function assertFinancialSafety(deposit: u128): void {
  assert(
    u128.le(deposit, MAXIMUM_PAY_TO_PLAY),
    "You are trying to attach too many NEAR Tokens to this call. There is a safe limit while in beta of 5 NEAR"
  );
}

/**
 * Asserts transaction caller is the contract owner.
 */
function assertOwner(): void {
  const caller = Context.predecessor;
  const owner = Context.contractName;
  assert(
    owner == caller,
    "Only the owner of this contract may call this method"
  );
}

/**
 * Returns the latest game.
 */
function getCurrentGame(): Game {
  const currentGameIndex = games.length - 1;
  return games[currentGameIndex];
}
