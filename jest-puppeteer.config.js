module.exports = {
  launch: {
    // TODO: parameter to rerun tests on a couple of viewport types.
    defaultViewport: {
      width: 1600,
      height: 900,
      deviceScaleFactor: 1,
    },
    headless: process.env.PUPPETEER_HEADLESS !== 'false',
    slowMo: parseInt(process.env.PUPPETEER_SLOWMO) || 0,
    devtools: process.env.PUPPETEER_DEVTOOLS === 'true',
    dumpio: true,
    product: process.env.PUPPETEER_PRODUCT || 'chrome',
  },
}
