import { VMContext } from "near-sdk-as";
import * as contract from "../assembly";
import { games } from "../assembly/model";

const setCallerAsOwner = (): void => {
  // default predecessor is carol
  // default contract name is alice
  VMContext.setPredecessor_account_id("alice");
  VMContext.setSigner_account_id("alice");
};

const animalIndex = 0;
const timestamp = 1643472431557; // 2022-01-29T16:07:11.557Z

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

describe("deleteCurrentGame method", () => {
  it("pops last game from games array when caller is owner", () => {
    setCallerAsOwner();
    contract.startGame(animalIndex, timestamp);
    contract.deleteCurrentGame();
    expect(games.length).toStrictEqual(0);
  });

  it("throws an error when caller is not owner", () => {
    expect(() => {
      contract.deleteCurrentGame();
    }).toThrow();
  });
});
