import { keyStores, Near, WalletConnection } from "near-api-js";
import getConfig from "../config";

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
  localStorage.removeItem(
    `near-api-js:keystore:${accountId.value}:${nearConfig.networkId}`
  );
  accountId.value = wallet.getAccountId();
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

export const getGamesHistory = () => {
  return wallet.account().viewFunction(CONTRACT_ID, "getGamesHistory");
};

//function to get bool value  has  lottery played or  no
export const getHasPlayed = (accountId) => {
  return wallet
    .account()
    .viewFunction(CONTRACT_ID, "get_has_played", { player: accountId });
};

export const getCurrentGame = () => {
  return wallet.account().viewFunction(CONTRACT_ID, "getCurrentGame");
};

// -----------------------------------------------------------------------------------
// change functions
// -----------------------------------------------------------------------------------

//function to startGame
export const startGame = async () => {
  let response = wallet.account().functionCall({
    contractId: CONTRACT_ID,
    methodName: "startGame",
    args: {
      accountId: CONTRACT_ID,
      animalIndex: 2,
      timestamp: Date.now().toString(),
    },
  });
  console.log(response);
};

//function to startGame
export const makeGuess = () => {
  let response = wallet.account().makeGuess({
    contractId: CONTRACT_ID,
    methodName: "startGame",
    args: { accountId: CONTRACT_ID },
  });
  console.log(response);
};
