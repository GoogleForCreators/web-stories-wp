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
import { mkdir, writeFile } from 'fs/promises';
import OriginalEnvironment from 'jest-environment-puppeteer';

const ARTIFACTS_PATH =
  process.env.E2E_ARTIFACTS_PATH ||
  (process.env.GITHUB_WORKSPACE || process.cwd()) + '/build/e2e-artifacts';

class PuppeteerEnvironment extends OriginalEnvironment {
  async setup() {
    await super.setup();

    try {
      await mkdir(ARTIFACTS_PATH, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }

  async handleTestEvent(event, state) {
    if (event.name === 'test_fn_failure') {
      const testName = `${state.currentlyRunningTest.parent.name}  ${state.currentlyRunningTest.name}`;
      const errors = state.currentlyRunningTest.errors;
      let errorMessages = '';
      errors.forEach((error) => {
        errorMessages += testName + '::' + error + '\n\n';
      });

      await this.storeArtifacts(testName, errorMessages);
    }

    // print error to console
    const ignoredEvents = [
      'setup',
      'add_hook',
      'start_describe_definition',
      'add_test',
      'finish_describe_definition',
      'run_start',
      'run_describe_start',
      'test_start',
      'hook_start',
      'hook_success',
      'test_fn_start',
      'test_fn_success',
      'test_done',
      'test_skip',
      'run_describe_finish',
      'run_finish',
      'teardown',
    ];
    if (!ignoredEvents.includes(event.name)) {
      // eslint-disable-next-line no-console
      console.log(
        new Date().toString() +
        ' Unhandled event(' +
        event.name +
        '): ' +
        util.inspect(event)
      );
    }
  }

  async storeArtifacts(testName, errorMessages) {
    const datetime = new Date().toISOString().split('.')[0];
    const fileName = `${testName} ${datetime}`.replaceAll(/[ :"/\\|?*]+/g, '-');

    await writeFile(`${ARTIFACTS_PATH}/${fileName}-errors.txt`, errorMessages);

    await writeFile(
      `${ARTIFACTS_PATH}/${fileName}-snapshot.html`,
      await this.global.page.content()
    );

    await this.global.page.screenshot({
      path: `${ARTIFACTS_PATH}/${fileName}.jpg`,
    });
  }
}

export default PuppeteerEnvironment;
