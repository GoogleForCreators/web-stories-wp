# Code Style

## Formatting

Linting is done through [ESLint](https://eslint.org/), code formatting is handled by [Prettier](https://prettier.io/), but integrated with ESLint.

## Organizing Components

Rule of thumb: small components belong to `index.js` file.
Larger ones should be split up and moved in a folder, where `index.js` exports the public parts of it.

## Naming Conventions

* Use `camelCase` for file names
* Use `PascalCase` for component names (components should always be named!)
