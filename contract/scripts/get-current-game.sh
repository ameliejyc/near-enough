#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call getCurrentGame function on the contract"
echo ---------------------------------------------------------
echo

near view $CONTRACT getCurrentGame --accountId $CONTRACT

exit 0