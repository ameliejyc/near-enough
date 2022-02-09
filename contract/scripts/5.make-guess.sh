#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call makeGuess function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT makeGuess '{"value": 50000, "timestamp":"1644349119141"}' --accountId near-enough.testnet --deposit 0.1

exit 0
