import {
  Context,
  logging,
  u128,
  ContractPromiseBatch,
} from "near-sdk-as";
import { Game, games, Guess, guesses } from "./model";
import { ONE_NEAR } from "./utils";

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
export function deleteLastGame(): void {
  assertOwner();
  // Remove the last game from the persistent collection
  games.pop();
  logging.log("Last game deleted")
}

/**
 * Adds a guess to the current game's guesses.
 * NOTE: This is a change method. Which means it will modify the state.
 */
export function makeGuess(value: i32, timestamp: u64): void {
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
  assert(value < 1000000000, "Guess value is not within range");

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
  logging.log("Guess made successfully! Fingers crossed.");
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
  const numberOfGuesses = guesses.length;
  const result = new Array<Guess>(numberOfGuesses);
  for (let i = 0; i < numberOfGuesses; i++) {
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
  logging.log("Game ended")
}

/**
 * Returns the latest game.
 */
export function getCurrentGame(): Game {
  const currentGameIndex = games.length - 1;
  return games[currentGameIndex];
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
  logging.log("All guesses deleted")
}

/***********************************************
 * Internal methods
 ************************************************/

/**
 * Calculates winner and updates the game. Calls function to transfer winnings.
 */
function setWinner(): void {
  assertOwner();
  const numberOfGuesses: i32 = guesses.length;
  // If there were no guesses, return early
  if (numberOfGuesses < 1) return;
  let guessTotal: i32 = 0;
  for (let a = 0; a < numberOfGuesses; a++) {
    guessTotal += guesses[a].guess;
  }
  const average: f32 = f32.div(<f32>guessTotal, <f32>numberOfGuesses);
  // Create new guesses array
  const guessesCopy = new Array<Guess>(numberOfGuesses);
  for (let i = 0; i < numberOfGuesses; i++) {
    guessesCopy[i] = guesses[i];
  }
  // Sort the guesses array
  const sortedGuesses = guessesCopy.sort((a, b) => {
    return a.guess - b.guess;
  });
  // Use divide and conquer function
  const winningGuess = findClosestGuess(
    sortedGuesses,
    average,
    0,
    numberOfGuesses - 1
  );
  let winner = winningGuess;
  // Return the first winner in the original guess array in case there are multiple winners
  for (let a = 0; a < numberOfGuesses; a++) {
    if (guesses[a].guess === winningGuess.guess) {
      winner = guesses[a];
      break;
    }
  }
  const currentGame = getCurrentGame();
  currentGame.setWinner(winner);
  games.replace(games.length - 1, currentGame);
  logging.log("Winner is set. Next: transferring winnings.")
  sendWinnerWinnings();
}

export function findClosestGuess(
  array: Guess[],
  value: f32,
  start: i32,
  end: i32
): Guess {
  if (start > end) {
    if (value - <f32>array[end].guess < <f32>array[start].guess - value) {
      return array[end];
    } else return array[start];
  }
  let mid = <i32>Math.floor((start + end) / 2);
  if (<f32>array[mid].guess === value) return array[mid];
  if (<f32>array[mid].guess > value)
    return findClosestGuess(array, value, start, mid - 1);
  else return findClosestGuess(array, value, mid + 1, end);
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
  ContractPromiseBatch.create(currentGame.winnerAccount).transfer(
    currentGame.winnings.total
  );
  logging.log(`Transfer to ${currentGame.winnerAccount} is complete`);

  // Reset winnings tracker
  currentGame.winnings.recordTransfer();

  // Replace the current game with the updated game
  games.replace(currentGameIndex, currentGame);
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
