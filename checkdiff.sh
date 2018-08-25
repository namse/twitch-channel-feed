#!/bin/bash

set -e

CHANGED_FILES=`git diff --name-only master...${TRAVIS_COMMIT}`
ONLY_READMES=True
INCLUDE=$1

for CHANGED_FILE in $CHANGED_FILES; do
  if ! [[ $CHANGED_FILE =~ $INCLUDE ]]; then
    ONLY_READMES=False
    break
  fi
done

if [[ $ONLY_READMES == True ]]; then
  echo "PASS"
  travis_terminate 0
  exit 1
else
  echo "continuing with build."
fi