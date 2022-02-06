import { keyStores, Near, WalletConnection } from "near-api-js";
import getConfig from "../config";
import Big from "big.js";

const PAY_TO_PLAY = 0.1;

export const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

export const DONATION_VALUE = Big(PAY_TO_PLAY)
  .times(10 ** 24)
  .toFixed();

const nearConfig = getConfig("development");
export const CONTRACT_ID =
  process.env.NODE_ENV === "development"
    ? "dev-1644060009063-98429528712440"
    : "nearenough.testnet";

export const near = new Near({
  networkId: nearConfig.networkId,
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: nearConfig.nodeUrl,
  walletUrl: nearConfig.walletUrl,
});

export const wallet = new WalletConnection(near, "near-enough");
export const accountId = wallet.getAccountId();

export function logout() {
  wallet.signOut();
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  wallet.requestSignIn(nearConfig.contractName);
}

// -----------------------------------------------------------------------------------
// view functions
// -----------------------------------------------------------------------------------

export const getGamesHistory = async () => {
  return await wallet.account().viewFunction(CONTRACT_ID, "getGamesHistory");
};

//function to get bool value  has  lottery played or  no
export const getHasPlayed = (accountId) => {
  return wallet
    .account()
    .viewFunction(CONTRACT_ID, "get_has_played", { player: accountId });
};

export const getCurrentGame = async () => {
  return await wallet.account().viewFunction(CONTRACT_ID, "getCurrentGame");
};

// -----------------------------------------------------------------------------------
// change functions
// -----------------------------------------------------------------------------------

export const startGame = async (index) => {
  let response = await wallet.account().functionCall({
    contractId: CONTRACT_ID,
    methodName: "startGame",
    args: {
      accountId: CONTRACT_ID,
      animalIndex: index,
      timestamp: Date.now().toString(),
    },
  });
  console.log(response);
};

export const makeGuess = async (value) => {
  let response = await wallet.account().functionCall({
    contractId: CONTRACT_ID,
    methodName: "makeGuess",
    attachedDeposit: DONATION_VALUE,
    args: { value, timestamp: Date.now().toString(), accountId: CONTRACT_ID },
  });
  console.log(response);
};
