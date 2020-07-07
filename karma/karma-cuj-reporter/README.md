# karma-cuj-reporter

Custom Karma reporter that tracks coverage of Critical User Journeys in the app and generates a Markdown table out of it.

## Prerequisites

Use nested `describe` blocks prefixed with `CUJ:` and `Action:`:

```js
describe('CUJ: <Name of the Critical User Journey>', () => {
  describe('Action: <Name of the Action>', () => {
    // Your tests go here.
  });
});
```

Tests without prefixes will be ignored.

## Configuration

```js
// karma.conf.js
module.exports = function (config) {
  config.set({
    // reporters configuration
    reporters: ['cuj'],
  });
};
```

## Options

**outputFile**
**Type:** String

**Default Values:**

None.

Define the full path to the file the Markdown table should be written to.

**Example:**

```js
// karma.conf.js

const path = require('path');

module.exports = function (config) {
  config.set({
    // reporters configuration
    reporters: ['cuj'],

    cujReporter: {
      outputFile: path.resolve(process.cwd(), 'build/cuj-coverage.md'),
    },
  });
};
```
