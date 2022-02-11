#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call getGamesHistory function on the contract"
echo ---------------------------------------------------------
echo

near view $CONTRACT getGamesHistory --accountId $CONTRACT

exit 0