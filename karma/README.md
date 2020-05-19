# Karma integration testing

## Browser support

Currently, only Puppeeter option is configured. It can run Chrome and Firefox browsers.
In the near future this may also be expanded to Playwright to support Safari and other
browsers.

For details on how to customize browser options, see [karma-puppeteer-launcher](./karma-puppeteer-launcher/README.md).

For details on exposed native browser APIs, see [karma-puppeteer-client](./karma-puppeteer-client/README.md).

## Common issues

### Annoying firewall question: "Do you want to the application Chromium.app to accept incoming network connections?"

See [Puppeteer issue 4752](https://github.com/puppeteer/puppeteer/issues/4752).

```sh
sudo codesign --force --deep --sign - ./node_modules/puppeteer/.local-chromium/mac-*/chrome-mac/Chromium.app
```
