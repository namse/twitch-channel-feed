#!/bin/bash

set -e

CHANGED_FILES=`git diff --name-only ${TRAVIS_COMMIT}`
CONTINUE=False
INCLUDE=$1

for CHANGED_FILE in $CHANGED_FILES; do
  if  [[ $CHANGED_FILE == ".travis.yml" ]] || [[ $CHANGED_FILE =~ $INCLUDE ]]; then
    CONTINUE=True
    break
  fi
done

if [[ $CONTINUE == False ]]; then
  echo "skip build"
  travis_terminate 0
  exit 1
else
  echo "continuing with build."
fi