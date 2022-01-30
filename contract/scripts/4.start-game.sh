#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call startGame function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT startGame '{"animalIndex": 2, "timestamp": "1643551108306"}' --accountId $CONTRACT

exit 0
