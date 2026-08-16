#!/bin/sh

PROJECT_NAME="null"

if [ "$PROJECT_NAME" = "null" ]; then
    printf "Project name: "
    read -r PROJECT_NAME
fi

if [ -z "$PROJECT_NAME" ]; then
    echo "Project name cannot be empty."
    exit 1
fi

printf "Commit message: "
read -r COMMIT_MESSAGE

if [ -z "$COMMIT_MESSAGE" ]; then
    echo "Commit message cannot be empty."
    exit 1
fi

GITHUB_USER=$(ssh -T git@github.com 2>&1 | sed -n 's/^Hi \([^!]*\)!.*$/\1/p')

if [ -z "$GITHUB_USER" ]; then
    echo "Could not determine GitHub username."
    exit 1
fi

REMOTE="git@github.com:$GITHUB_USER/$PROJECT_NAME.git"

git init 2>/dev/null
git remote get-url origin >/dev/null 2>&1 && \
git remote set-url origin "$REMOTE" || \
git remote add origin "$REMOTE"

git add -A
git commit -m "$COMMIT_MESSAGE"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    sed -i 's/^PROJECT_NAME=".*"/PROJECT_NAME="null"/' "$0"
    echo "Done: https://github.com/$GITHUB_USER/$PROJECT_NAME"
fi