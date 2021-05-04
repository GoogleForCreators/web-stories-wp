# Unit Tests

## PHP

This project uses the [PHPUnit](https://phpunit.de/) testing framework to write unit and integration tests for the PHP part.   

Tests are run against a running WordPress instance through the [WordPress PHPUnit Test Suite](https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/). 
For improved cross version compatibility for PHPUnit, the [WP Test Utils](https://github.com/Yoast/wp-test-utils) is implemented.

To run the full test suite, you can use the following command:

```bash
npm run test:php
```

You can also just run test for a specific function or class by using something like this:

```bash
npm run test:php -- --filter=Story_Post_Type
```

See `npm run test:php:help` to see all the possible options.

### Writing PHP Tests

#### Useful Resources for PHP Tests

* [Using the WordPress PHPUnit Test Suite](https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/)

## JavaScript

[Jest](https://jestjs.io/) is used as the JavaScript unit testing framework.

To run the full test suite, you can use the following command:

```bash
npm run test:js
```

You can also watch for any file changes and only run tests that failed or have been modified:

```bash
npm run test:js:watch
```

See `npm run test:js:help` to get a list of additional options that can be passed to the test runner.

### API

The [Jest docs](https://jestjs.io/docs/en/getting-started) have a good introduction into how to write tests using Jest.

[`jest-dom`](https://github.com/testing-library/jest-dom) and [`jest-extended`](https://github.com/jest-community/jest-extended) are used in the project to extend test assertions beyond Jest's defaults.

**Attention**: both these libraries have a `toBeEmpty` assertion. If you want the one from `jest-dom`, use `toBeEmptyNode` instead.

React components and hooks are tested using [Testing Library](https://testing-library.com/docs/intro).

### Test Utils

* In the project, there are `testUtils` folders with custom test utilities like `renderWithTheme` that can be used to make writing tests easier.

### Custom Matchers

The following custom matchers exist in the project:

* `toBeValidAMP`
* `toBeValidAMPStoryPage`
* `toBeValidAMPStoryElement`

### Writing JavaScript Tests

#### Useful Resources for JavaScript Tests

* [Jest documentation](https://jestjs.io/docs/en/getting-started)
* [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
* ["Which query should I use?"](https://testing-library.com/docs/guide-which-query)
* [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
* [React Hooks Testing Library](https://react-hooks-testing-library.com/)
* [`jest-dom` API](https://github.com/testing-library/jest-dom#custom-matchers)
* [`jest-extended` API](https://github.com/jest-community/jest-extended#api)

#### Naming Conventions

**File Names**:
If a component or function to be tested resides in `foo/bar/baz.js`, it is recommend to place the tests in `foo/bar/tests/baz.js`. There is no need for a `.test.js` file name suffix.

**Test Names**:
The test name should be a proper sentence, starting with `it`. This provides more readable test failures. Example:

```js
describe('sum', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
```

This will be reported as "sum > (it) adds 1 + 2 to equal 3".

### Snapshot Testing

Try to avoid using snapshots when rendering components works just as well. If needed, use `toMatchInlineSnapshot`.

### Code Coverage

Use the following command to run code JavaScript tests with code coverage.

```bash
npm run test:js:coverage
```

One tests ran successfully, the coverage report will automatically open in your browser.
