/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { mkdirSync, writeFileSync } from 'fs';
import util from 'node:util';
import JestPuppeteer from 'jest-environment-puppeteer';

const ARTIFACTS_PATH =
  process.env.E2E_ARTIFACTS_PATH ||
  (process.env.GITHUB_WORKSPACE || process.cwd()) + '/build/e2e-artifacts';

class PuppeteerEnvironment extends JestPuppeteer.TestEnvironment {
  async setup() {
    await super.setup();

    try {
      mkdirSync(ARTIFACTS_PATH, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure' || event.name === 'hook_failure') {
      const testName =
        event.name === 'test_fn_failure'
          ? `${state.currentlyRunningTest.parent.name}  ${state.currentlyRunningTest.name}`
          : 'before or after hook';

      let errorMessages = '';

      if (event.test) {
        const errors = state.currentlyRunningTest?.errors || [];
        const eventError = util.inspect(event);
        errorMessages += `========= ${testName} ==========\n\n`;
        errorMessages +=
          'started:' +
          new Date(event.test.startedAt).toLocaleString() +
          ' ended:' +
          new Date().toLocaleString();
        errorMessages += '============end==========\n\n';
        errors.forEach((error) => {
          errorMessages += `${testName}:${error}\n\n`;
        });
        errorMessages += '=========================\n\n';
        errorMessages += eventError;
      }

      await this.storeArtifacts(testName, errorMessages);
    }
  }

  async storeArtifacts(testName, errorMessages) {
    const datetime = new Date().toISOString().split('.')[0];
    const fileName = `${testName} ${datetime}`.replaceAll(/[ :"/\\|?*]+/g, '-');

    writeFileSync(`${ARTIFACTS_PATH}/${fileName}-errors.txt`, errorMessages);

    if (this.global.page.isClosed()) {
      return;
    }

    writeFileSync(
      `${ARTIFACTS_PATH}/${fileName}-snapshot.html`,
      await this.global.page.content()
    );

    await this.global.page.screenshot({
      path: `${ARTIFACTS_PATH}/${fileName}.jpg`,
    });
  }
}

export default PuppeteerEnvironment;
