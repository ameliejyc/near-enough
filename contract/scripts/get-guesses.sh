#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call getGuesses function on the contract"
echo ---------------------------------------------------------
echo

near view $CONTRACT getGuesses --accountId $CONTRACT

exit 0