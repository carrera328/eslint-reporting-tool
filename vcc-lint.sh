#!/bin/sh

# you run me in a bash/zsh - unix shell. e.g. Git Bash

npx eslint ./javascriptComponents/ --format json --output-file result.json
node -p "require('./node_modules/eslint/lib/cli-engine/formatters/unix.js')(require('./result.json'))"