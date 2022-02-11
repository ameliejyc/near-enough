# NEAR enough

Here are the available contract API call methods.

- ### **startGame** - Starts a new game for a given animal and at a given time.

`startGame(animalIndex: i32, timestamp: u64): void`

The contract owner can call this method to start a new game using ./scripts/start-game.sh.

- ### **makeGuess** - Adds a guess with a given value at the given time to the current guesses PersistentVector.

`makeGuess(value: i32, timestamp: u64): void`

Any participant can call this method to make a guess using ./scripts/make-guess.sh.

- ### **deleteGuesses** - Deletes all current guesses from storage.

`deleteGuesses(): void`

The contract owner can call this method to delete all current guesses using ./scripts/delete-guesses.sh.

- ### **endGame** - Ends the game by calculating the winner and updating the Game model, sending the winner NEAR and deleting the guesses.

`endGame(): void`

The contract owner can call this method to wrap up a game using ./scripts/end-game.sh.

- ### **deleteLastGame** - Deletes the last game from the Games PersistentVector without calculating a winner.

`deleteLastGame(): void`

The contract owner can call this method to delete a game using ./scripts/delete-last-game.sh.

---

And here are the API view methods.

- ### **getGamesHistory** - Returns the PersistentVector list of all past and present games.

`getGamesHistory(): Game[]`

Anyone can call this method to see the games history using ./scripts/get-games-history.sh.

- ### **getGuesses** - Returns the PersistentVector list of all current guesses.

`getGuesses(): Guess[]`

The contract owner can call this method to see the current guesses using ./scripts/get-guesses.sh.

- ### **getWinnings** - Returns the value of the current game's winnings.

`getWinnings(): u128`

Anyone can call this method to see the current winnings using ./scripts/get-winnings.sh.

- ### **getCurrentGame** - Returns the current Game.

`getCurrentGame(): Game`

Anyone can call this method to see the current Game using ./scripts/get-current-game.sh.

---

## Exploring The Code

1. The main smart contract code lives in `assembly/index.ts`. You can compile
   it with the `./compile` script.
2. Tests: You can run smart contract tests with the `./test` script. This runs
   standard AssemblyScript tests using [as-pect].

[as-pect]: https://www.npmjs.com/package/@as-pect/cli

This repo was bootstrapped by the [near-sdk-as Starter Kit](https://github.com/Learn-NEAR/starter--near-sdk-as).

## The file system

```sh
├── README.md                          # this file
├── as-pect.config.js                  # configuration for as-pect (AssemblyScript unit testing)
├── asconfig.json                      # configuration for AssemblyScript compiler (supports multiple contracts)
├── package.json                       # NodeJS project manifest
├── scripts
│   ├── 1.dev-deploy.sh                # helper: build and deploy contracts
│   ├── 2.use-contract.sh              # helper: call methods on ContractPromise
│   ├── 3.cleanup.sh                   # helper: delete build and deploy artifacts
│   └── README.md                      # documentation for helper scripts
├── src
│   ├── as_types.d.ts                  # AssemblyScript headers for type hints
│   ├── simple                         # Contract 1: "Simple example"
│   │   ├── __tests__
│   │   │   ├── as-pect.d.ts           # as-pect unit testing headers for type hints
│   │   │   └── index.unit.spec.ts     # unit tests
│   │   ├── asconfig.json              # configuration for AssemblyScript compiler (one per contract)
│   │   └── assembly
│   │       └── index.ts               # contract code
│   ├── tsconfig.json                  # Typescript configuration
│   └── utils.ts                       # common contract utility functions
└── yarn.lock                          # project manifest version lock
```

### Other documentation

- See `./scripts/README.md` for documentation about the scripts

