import { context, u128, PersistentVector } from "near-sdk-as";

const animals = ["lemur", "elephant", "ant", "seal", "donkey", "crocodile"];

@nearBindgen
export class Game {
  animal: string;
  wallet: string;
  endTime: u64;
  winnerAccount: string;
  winnerGuess: number;
  winnings: WinningsTracker = new WinningsTracker();
  // currently passing animalIndex and endTime from the frontend to avoid incomprehensible issues in AS
  constructor(animalIndex: i32, timestamp: u64) {
    this.wallet = context.sender;
    this.animal = animals[animalIndex];
    this.endTime = timestamp + 24 * 60 * 60 * 1000;
    this.winnerAccount = "";
  }

  setWinner(winner: Guess): void {
    this.winnerAccount = winner.sender;
    this.winnerGuess = winner.guess;
    // winnings?
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

@nearBindgen
export class WinningsTracker {
  total: u128 = u128.Zero;
  transferred: u128 = u128.Zero;

  update(value: u128): void {
    // Track total winnings in the pool
    this.total = u128.add(this.total, value);
  }

  recordTransfer(): void {
    this.transferred = u128.add(this.transferred, this.total);
    this.total = u128.Zero;
  }
}

export const games = new PersistentVector<Game>("g");
export const guesses = new PersistentVector<Guess>("h");
