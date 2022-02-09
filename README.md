# [NEAR enough](ameliejyc.github.io/near-enough) - a wisdom of the crowd guessing game!

This README is for the front end React code. Check out the README in `./contract` for the contract AssemblyScript code.

# What is it?

NEAR enough is a personal project made to practice building smart contracts in AssemblyScript, exposing methods through a front end, transferring NEAR and developing experience with NEAR build processes.

# How is it made?

I started building the contract using [near-sdk-as Starter Kit](https://github.com/Learn-NEAR/starter--near-sdk-as). After that I took some parts from a [create-near-app] to bootstrap a front end quickly. The whole thing was very fun.

# Todo

- I had problems with AssemblyScript number types. Specifically generating dates and random numbers. As a result I pass these values from JS to the contract (e.g. in `makeGuess`) as it was giving me less grief than doing it in AS, but I would like to refactor this in future.
- Currently starting and ending games is a manual process made by the contract owner. I would like this to be automated, e.g. games start and end at certain times every week. I have no idea how to do this yet.
- I'm not accounting for transaction fees properly in the end game when I transfer winnings to the winner. I need to investigate more how I should be covering my costs.
- Add some kind of success messaging when a guess is successfully submitted.
- Convert JS to TS. Should have done this from the start but I was too eager to see things working.
- Write more contract unit tests, plus integ tests and UI tests.

# Learnings

- I deployed to testnet server but GitHub thought it was mainline due to the config.js setup, so I amended according to [this](https://stackoverflow.com/questions/69952774/reactjs-not-call-method-from-smart-contract-near-on-product-testnet-does-not).
- I am still getting used to the development environent but so far I think this:
  - Having scripts run method calls seems more effort up front, but pays off in the long run to not have to write things out on the command line.
  - Think carefully up front about types in the contract model. Changing the types after already having items in storage may lead to a lot of errors.

The rest of the README contains helpful setup notes from [create-near-app].

---

# Quick Start

To run this project locally:

1. Prerequisites: Make sure you've installed [Node.js] ≥ 12
2. Install dependencies: `yarn install` and `cd ./contract yarn install`
3. Run the local development server: `yarn dev` (see `package.json` for a
   full list of `scripts` you can run with `yarn`)

Now you'll have a local development environment backed by the NEAR TestNet!

Go ahead and play with the app and the code. As you make code changes, the app will automatically reload.

# Exploring The Code

1. The "backend" code lives in the `/contract` folder. See the README there for
   more info.
2. The frontend code lives in the `/src` folder. `/src/index.html` is a great
   place to start exploring. Note that it loads in `/src/index.js`, where you
   can learn how the frontend connects to the NEAR blockchain.
3. Tests: there are different kinds of tests for the frontend and the smart
   contract. See `contract/README` for info about how it's tested. The frontend
   code gets tested with [jest]. You can run both of these at once with `yarn run test`.

# Deploy

Every smart contract in NEAR has its [own associated account][near accounts]. When you run `yarn dev`, your smart contract gets deployed to the live NEAR TestNet with a throwaway account. When you're ready to make it permanent, here's how.

## Step 0: Install near-cli (optional)

[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `yarn install`, but for best ergonomics you may want to install it globally:

    yarn install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)

## Step 1: Create an account for the contract

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `near-enough.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `near-enough.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

   near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

   near create-account near-enough.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet

## Step 2: set contract name in code

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'near-enough.YOUR-NAME.testnet'

## Step 3: deploy!

One command:

    yarn deploy

As you can see in `package.json`, this does two things:

1. builds & deploys smart contract to NEAR TestNet
2. builds & deploys frontend code to GitHub using [gh-pages]. This will only work if the project already has a repository set up on GitHub. Feel free to modify the `deploy` script in `package.json` to deploy elsewhere.

[react]: https://reactjs.org/
[create-near-app]: https://github.com/near/create-near-app
[node.js]: https://nodejs.org/en/download/package-manager/
[jest]: https://jestjs.io/
[near accounts]: https://docs.near.org/docs/concepts/account
[near wallet]: https://wallet.testnet.near.org/
[near-cli]: https://github.com/near/near-cli
[gh-pages]: https://github.com/tschaub/gh-pages
