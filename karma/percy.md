# Running Percy

These are temporary steps until we set up the CI.

1. Write a bunch of tests with `await karmaPuppeteer.saveSnapshot('name')`.
2. Set token: `export PERCY_TOKEN=`.
3. Run `npm run test:karma:watch -- --snapshots`.
4. Pull snapshot: `npx percy snapshot --config=percy.config.yml .test_artifacts/karma_snapshots/`.
5. Once the upload is done and the test run is scheduled, follow the test link in the console.
