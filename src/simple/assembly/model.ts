import { context, u128, PersistentVector } from "near-sdk-as";

const animals = ["lemur", "elephant", "ant", "seal", "donkey", "crocodile"];

@nearBindgen
export class Game {
  // animal: string;
  wallet: string;
  // endTime: u64;
  winnerAccount: string;
  winnerGuess: number;
  winnings: number;
  constructor() {
    this.wallet = context.sender;
    // this.animal = animals[<i32>Math.floor(Math.random() * animals.length)];
    // error on animal is "wasm execution failed with error: FunctionCallError(LinkError { msg: \"Error while importing \\\"env\\\".\\\"seed\\\": unknown import. Expected Function(FunctionType { params: [], results: [F64] })\" })"
    // this.endTime = Date.now() + 24 * 60 * 60 * 1000;
    // error on endTime is "wasm execution failed with error: FunctionCallError(CompilationError(PrepareError(Instantiate)))"
    this.winnerAccount = "";
  }

  setWinner(winner: Guess): void {
    this.winnerAccount = winner.sender;
    this.winnerGuess = winner.guess;
    this.winnings = 1; // something to do with the account wallet here
  }
}

@nearBindgen
export class Guess {
  premium: boolean;
  sender: string;
  guess: number;
  constructor(guess: number) {
    this.premium =
      context.attachedDeposit >= u128.from("10000000000000000000000");
    this.sender = context.sender;
    this.guess = guess;
  }
}

export const games = new PersistentVector<Game>("g");
export const guesses = new PersistentVector<Guess>("h");
