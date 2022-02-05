#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call makeGuess function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT makeGuess '{"value":25.1, "timestamp":"1644092489637"}' --accountId nearenough.testnet --deposit 0.1

exit 0
