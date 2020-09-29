# karma-puppeteer-client

The karma-puppeteer-launcher exposes a few Puppeteer APIs, mainly related to native
events and nantive browser support. The APIs are exposed via `karmaPuppeteer` global.

Notice, that all exposed Puppeeter APIs that accept an element selector, also
accept the element reference in its place. Thus, both of these forms are valid:

```JavaScript
karmaPuppeteer.click('.element1') // Valid. Finds the element by the selector.
karmaPuppeteer.click(element1) // Also valid. Passes the element by reference.
```

## Supported APIs

### karmaPuppeteer.click

See [puppeteer.click](https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pageclickselector-options).

### karmaPuppeteer.focus

See [puppeteer.focus](https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pagefocusselector).

### karmaPuppeteer.select

See [puppeteer.select](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#frameselectselector-values).

### karmaPuppeteer.keyboard

See [puppeteer.keyboard](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard).

Methods:

- [`down(key, options)`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboarddownkey-options).
- [`up(key, options)`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardupkey-options).
- [`press(key, options)`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardpresskey-options).
- [`type(text, options)`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardtypetext-options).
- [`sendCharacter(text, options)`](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardsendcharacterchar).
- `seq([{type: 'up'|'down'|'press', key, options}])` - a sequence of down/up/press.

### karmaPuppeteer.mouse

See [puppeteer.mouse](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse).

Methods:

- `seq([{type: 'up'|'down'|'press', x, y, options}])` - a sequence of move/down/up/click.
