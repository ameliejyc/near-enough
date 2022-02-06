import { context, u128, PersistentVector } from "near-sdk-as";

const animals = [
  "goat",
  "ostrich",
  "rhino",
  "donkey",
  "koala",
  "dolphin",
  "crow",
  "crab",
  "bear",
];

const images = [
  "https://images.ctfassets.net/wc253zohgsra/3VWyJesJwogej5HXQov5X3/aa538bff273bd5f1ecff9d8b2b6dbbbc/goat.png",
  "https://images.ctfassets.net/wc253zohgsra/4PFDo5WRrtyVND0tnW6Puh/642619fba4b9c1093c8fd421635f1ee9/ostrich.png",
  "https://images.ctfassets.net/wc253zohgsra/38vzSCy6ZxtY8eK0csk3kv/128d1ad2bfa7ba4993c0d025ac8d6b81/rhino.png",
  "https://images.ctfassets.net/wc253zohgsra/XNifVNTg0uvbGuxXO8Y1S/90138a33e1d908e357bc1ef46db0cd14/donkey.png",
  "https://images.ctfassets.net/wc253zohgsra/56CI18iiOB5RHysh8mWjOy/69cd3e1db1074acb29fad761f2eaf8ba/koala.png",
  "https://images.ctfassets.net/wc253zohgsra/1xCGLDkLX849F5ykbHx50t/a4e9836ee31ddddf533cb2a9a17cb063/dolphin.png",
  "https://images.ctfassets.net/wc253zohgsra/3dDIYzFY1e0mwjVC29V2Eg/011727dc343a35930a1c7fad385b3703/crow.png",
  "https://images.ctfassets.net/wc253zohgsra/3MKlnf5z0ueQx1GQYjF1Rx/be5ec4d8fa2a0b40c2cdfe5f7d4762c1/crab.png",
  "https://images.ctfassets.net/wc253zohgsra/1NkQjYoY78zegHvz1q5XLp/b7649a3d4c47f40afd5218ba8b32f80e/bear.png",
];

@nearBindgen
export class Game {
  animal: string;
  imageUrl: string;
  wallet: string;
  endTime: u64;
  winnerAccount: string;
  winnerGuess: i32;
  winnings: WinningsTracker = new WinningsTracker();
  // currently passing animalIndex and endTime from the frontend to avoid incomprehensible issues in AS
  constructor(animalIndex: i32, timestamp: u64) {
    this.wallet = context.sender;
    this.animal = animals[animalIndex];
    this.imageUrl = images[animalIndex];
    this.endTime = timestamp + 24 * 60 * 60 * 1000;
    this.winnerAccount = "";
  }

  setWinner(winner: Guess): void {
    this.winnerAccount = winner.sender;
    this.winnerGuess = winner.guess;
  }
}

@nearBindgen
export class Guess {
  sender: string;
  guess: i32;
  constructor(guess: i32) {
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
