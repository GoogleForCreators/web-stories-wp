# Integration Tests

Karma + Jasmine are used for running integration tests in the browser.

More details can be found in the `/karma` folder and the corresponding `README`s.

To run the full test suite, you can use the following commands:

```bash
npm run test:karma:edit-story -- --headless --viewport=1600:1000
npm run test:karma:dashboard -- --headless --viewport=1600:1000
```

## Custom Matchers

There are a few custom matchers inspired by Jest and `jest-dom`:

* `toBeEmpty`
* `toHaveFocus`
* `toHaveStyle`
* `toHaveProperty`
* `toBeOneOf`

Plus another custom async matcher inspired by [`jest-axe`](https://github.com/nickcolley/jest-axe) to test for accessibility violations:

* `toHaveNoViolations`

## Writing Tests

### Useful Resources

* [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
* ["Which query should I use?"](https://testing-library.com/docs/guide-which-query)
* [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
* [React Hooks Testing Library](https://react-hooks-testing-library.com/)
