#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call deleteGuesses function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT deleteGuesses --accountId $CONTRACT

exit 0
