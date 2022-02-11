#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call getWinnings function on the contract"
echo ---------------------------------------------------------
echo

near view $CONTRACT getWinnings --accountId $CONTRACT

exit 0