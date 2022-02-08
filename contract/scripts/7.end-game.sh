#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call endGame function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT endGame --accountId nearenough.testnet

exit 0
