
1. Write a bunch of tests with `await karmaPuppeteer.saveSnapshot('name')`.
2. Set token: `export PERCY_TOKEN=`.
2. Run `npm run test:karma:watch -- --snapshots`.
3. Pull snapshot: `npx percy snapshot --config=percy.config.yml .test_artifacts/karma_snapshots/`.
4. See https://percy.io/ampproject/web-stories-wp-test/builds/5277338
