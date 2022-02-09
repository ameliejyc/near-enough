#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call endGame function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT endGame --accountId near-enough.testnet

exit 0
