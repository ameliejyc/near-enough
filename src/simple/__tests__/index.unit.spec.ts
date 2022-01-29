import { VMContext } from "near-sdk-as";
import * as contract from "../assembly";
import { games } from "../assembly/model";

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
    contract.startGame();
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
    contract.startGame();
    expect(games.length).toStrictEqual(1);
  });

  it("throws an error when caller is not owner", () => {
    expect(() => {
      contract.startGame();
    }).toThrow();
  });
});

describe("deleteCurrentGame method", () => {
  it("pops last game from games array when caller is owner", () => {
    setCallerAsOwner();
    contract.startGame();
    contract.deleteCurrentGame();
    expect(games.length).toStrictEqual(0);
  });

  it("throws an error when caller is not owner", () => {
    expect(() => {
      contract.deleteCurrentGame();
    }).toThrow();
  });
});
