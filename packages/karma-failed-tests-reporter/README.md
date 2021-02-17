# karma-failed-tests-reporter

Custom Karma reporter that writes the names of all failed specs to a file.

This can be used to easily re-run only failed tests by providing the `--grep` option in Karma.

## Configuration

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    // reporters configuration
    reporters: ['failed-tests'],
  });
};
```

## Options

**outputFile**
**Type:** String

**Default Values:**

None.

Define the full path to the file to be written.

**Example:**

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    // reporters configuration
    reporters: ['failed-tests'],

    failedTestsReporter: {
      outputFile: 'path/to/file.txt',
    },
  });
};
```
