#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call startGame function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT startGame '{"animalIndex": 1, "timestamp": "1644370004979"}' --accountId $CONTRACT

exit 0
