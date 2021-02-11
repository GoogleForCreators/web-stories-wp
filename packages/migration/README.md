# Migrations

This package contains the code to migrate stories and templates to the latest version.

## Exports

* `DATA_VERSION`: the latest version
* `migrate`: the function to migrate a story, given a data object and the story's current version. 

## Used by

* Dashboard
* Editor
* Continuous Integration (automated migrations of templates and FTUE story)

## ES Module

This package uses depends on third-party packages like [`polished`](https://www.npmjs.com/package/polished).

To ensure the migrations can be run via Node.js on CI, [Rollup](https://rollupjs.org/guide/en/) is used to create a working ES module for it.

Usage:

```bash
$ npx rollup --config rollup.config.migrate.js
index.js → module.js...
created module.js in 123ms
```
