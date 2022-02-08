import { VMContext, u128 } from "near-sdk-as";
import { ONE_NEAR } from "../utils";
import * as contract from "..";
import { games, Guess, guesses } from "../model";

const animalIndex = 0;
const timestamp = 1643472431557; // 2022-01-29T16:07:11.557Z
const guessTimestamp = 1643473865460; // 2022-01-29T16:31:05.460Z

const setCallerAsOwner = (): void => {
  // default predecessor is carol
  // default contract name is alice
  VMContext.setPredecessor_account_id("alice");
  VMContext.setSigner_account_id("alice");
};

// VIEW method tests
describe("getGamesHistory method", () => {
  it("returns array of games when caller is owner", () => {
    setCallerAsOwner();
    contract.startGame(animalIndex, timestamp);
    const gamesHistory = contract.getGamesHistory();
    expect(gamesHistory.length).toStrictEqual(1);
  });

  it("returns array of games when caller is not owner", () => {
    const gamesHistory = contract.getGamesHistory();
    expect(gamesHistory.length).toStrictEqual(0);
  });
});

// CHANGE method tests
describe("startGame method", () => {
  it("pushes new game to games array when caller is owner", () => {
    setCallerAsOwner();
    contract.startGame(animalIndex, timestamp);
    expect(games.length).toStrictEqual(1);
    expect(games[0].endTime).toStrictEqual(1643558831557 as u64);
  });

  it("throws an error when caller is not owner", () => {
    expect(() => {
      contract.startGame(animalIndex, timestamp);
    }).toThrow();
  });
});

describe("deleteLastGame method", () => {
  it("pops last game from games array when caller is owner", () => {
    setCallerAsOwner();
    contract.startGame(animalIndex, timestamp);
    contract.deleteLastGame();
    expect(games.length).toStrictEqual(0);
  });

  it("throws an error when caller is not owner", () => {
    expect(() => {
      contract.deleteLastGame();
    }).toThrow();
  });
});

describe("makeGuess method", () => {
  beforeEach(() => {
    setCallerAsOwner();
    VMContext.setAttached_deposit(u128.div10(ONE_NEAR));
    contract.startGame(animalIndex, timestamp);
  });

  it("pushes new guess to guesses array", () => {
    contract.makeGuess(8, guessTimestamp);
    expect(guesses.length).toStrictEqual(1);
  });

  it("updates the current game winnings", () => {
    contract.makeGuess(8, guessTimestamp);
    expect(games[0].winnings.total).toBeGreaterThan(u128.Zero);
  });

  it("throws an error when games array is empty", () => {
    contract.deleteLastGame();
    expect(() => {
      contract.makeGuess(8, guessTimestamp);
    }).toThrow();
  });

  it("throws an error when the game has already finished", () => {
    expect(() => {
      contract.makeGuess(8, guessTimestamp + 100000000);
    }).toThrow();
  });

  it("throws an error when the deposit is too low", () => {
    VMContext.setAttached_deposit(u128.div(ONE_NEAR, u128.from(100)));
    expect(() => {
      contract.makeGuess(8, guessTimestamp);
    }).toThrow();
  });

  it("throws an error when the deposit is too high", () => {
    VMContext.setAttached_deposit(u128.mul(ONE_NEAR, u128.from(6)));
    expect(() => {
      contract.makeGuess(8, guessTimestamp);
    }).toThrow();
  });
});

describe("deleteGuesses method", () => {
  beforeEach(() => {
    VMContext.setAttached_deposit(u128.div10(ONE_NEAR));
  });
  test("empties the guesses array when caller is owner", () => {
    setCallerAsOwner();
    contract.startGame(animalIndex, timestamp);
    contract.makeGuess(8, guessTimestamp);
    expect(guesses.length).toStrictEqual(1);
    contract.deleteGuesses();
    expect(guesses.length).toStrictEqual(0);
  });

  it("throws an error when caller is not owner", () => {
    expect(() => {
      contract.deleteLastGame();
    }).toThrow();
  });
});

describe("findClosestGuess function", () => {
  test("returns correct answers", () => {
    const guess1 = new Guess(1);
    const guess2 = new Guess(2);
    const guess3 = new Guess(3);
    const guess4 = new Guess(3);
    const guess5 = new Guess(3);
    const guess6 = new Guess(3);
    const guess7 = new Guess(4);
    const guess8 = new Guess(7);
    const array = [
      guess1,
      guess2,
      guess3,
      guess4,
      guess5,
      guess6,
      guess7,
      guess8,
    ];
    const average = <f32>3.25;
    const winner = contract.findClosestGuess(
      array,
      average,
      0,
      array.length - 1
    );
    log(winner);
    expect(winner).toStrictEqual(guess3);
  });
});
