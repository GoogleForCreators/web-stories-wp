# Accessibility Testing

## Manual Testing

### Resources

* [Introduction to Keyboard Navigation](https://rianrietveld.com/2016/05/keyboard/)

### Screen Reader

**macOS**: VoiceOver (built-in)
**Windows**: [NVDA](https://www.nvaccess.org/about-nvda/) (free)
**ChromeOS**: ChromeVox
**Browser**: [ChromeVox Classic](https://chrome.google.com/webstore/detail/chromevox-classic-extensi/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) (no longer supported, so use with care, and perhaps only in combination with NVDA/VoiceOver

### VoiceOver

On a MacBook, press <kbd><kbd>CMD</kbd><kbd>F5</kbd></kbd> to enable VoiceOver. You can configure VoiceOver using the built-in VoiceOver Utility.

Navigation: Control + Option is the VoiceOver key.

Key | Behavior
-- | --
VoiceOver key + left/right arrow | move around the page
VoiceOver key + command + H | skip to headings
VoiceOver key + command + J | skip to the next control
Control | stop verbalization
VoiceOver key + H > H | display a full list of shortcuts
VoiceOver key + U | open rotor (which allows you to customize navigation and focus on browser content inside Chrome)
VoiceOver key + Space | interact with an element

Note: make sure to [enable full keyboard access](http://www.weba11y.com/blog/2014/07/07/keyboard-navigation-in-mac-browsers/) in the macOS system prefs.

### NVDA

To configure NVDA, press Insert + N or Caps Lock + N and navigate to Preferences.

Key | Behavior
-- | --
NVDA key + Arrow | move around the page
NVDA key + H | skip to headings
NVDA key + B | skip to buttons
Control | stop verbalization

More shortcuts can be found on [WebAIM.org](https://webaim.org/resources/shortcuts/nvda).

### General Info

#### Interaction Modes

There are two different interaction modes that a screen reader can be navigating in: forms mode and application mode. If keys suddenly stop doing what you expect them to do, you may have unintentionally triggered a mode switch. You likely should restart your screen reader.

See [Understanding screen reader interaction modes](https://tink.uk/understanding-screen-reader-interaction-modes/) for more information.

#### Accessibility Tree

The browser converts the DOM tree into an accessibility tree, which is what screen readers interact with. In Chrome, you can view the accessibility tree for easier debugging by going to `chrome://accessibility`.

### Dev Tools

Check out the [Chrome Dev Tools Accessibility Reference](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference).

There's also an [aXe extension](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd) that complements the DevTools built-in feature.

## Unit Tests

Use the `toHaveNoViolations` matcher provided by `jest-axe` to verify that a component does not have any accessibility issues. Example:

```js
function MyAwesomeComponent() {
  // ...
}

it('should render with no accessibility issues', async () => {
    const { container } = render(<MyAwesomeComponent />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
```

## Integration Tests

There's also a `toHaveNoViolations` matcher available in the Karma test suite. Example:

```js
it('should render with no accessibility issues', async () => {
    fixture = new Fixture();
    await fixture.render();
    await expectAsync(fixture.my.custom.element.node).toHaveNoViolations();
});
```
