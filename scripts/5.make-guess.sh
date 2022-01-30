#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call makeGuess function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT makeGuess '{"value":8.0, "timestamp":"1643551168306"}' --accountId ameliejyc.testnet --deposit 0.1

exit 0
