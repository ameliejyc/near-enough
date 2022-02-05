#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call startGame function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT startGame '{"animalIndex": 8, "timestamp": "1644093755623"}' --accountId $CONTRACT

exit 0
