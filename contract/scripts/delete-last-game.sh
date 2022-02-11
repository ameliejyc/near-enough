#!/usr/bin/env bash
echo
echo ---------------------------------------------------------
echo "Call deleteLastGame function on the contract"
echo ---------------------------------------------------------
echo

near call $CONTRACT deleteLastGame --accountId $CONTRACT

exit 0
