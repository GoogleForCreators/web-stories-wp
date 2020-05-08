/*
 * Copyright 2020 Google LLC
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

// Make Jasmine just a tiny bit more like Jest and Mocha.
self.describe.only = self.fdescribe;
self.it.only = self.fit;
self.describe.skip = self.xdescribe;
self.it.skip = self.xit;

let currentSpec;
let rootEl;

beforeAll(() => {
  jasmine.getEnv().addReporter({
    specStarted(result) {
      currentSpec = result;
    },
    specDone(result) {
      currentSpec = null;
    },
  });

  window.karmaSnapshot = (name) => {
    return karmaPuppeteer.saveSnapshot(currentSpec?.fullName, name);
  };
});

beforeEach(() => {
  rootEl = document.createElement('test-root');
  rootEl.innerHTML = `
    <style>
      test-root, test-body {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0;
      }
      test-body > div {
        width: 100%;
        height: 100%;
      }
    </style>
    <test-body>
    </test-body>
  `;
  document.body.appendChild(rootEl);
  const body = rootEl.querySelector('test-body');

  spyOnProperty(document, 'documentElement', 'get').and.returnValue(rootEl);
  spyOnProperty(document, 'body', 'get').and.returnValue(body);
  // @todo: ideally we can find a way to use a new <head> for each test, but
  // styled-components uses some side-effect-y global constants to manage
  // the stylesheet state, e.g. `masterSheet`.
  // See https://github.com/styled-components/styled-components/blob/4add697ac770634300f7775fc880882b5497bdf4/packages/styled-components/src/models/StyleSheetManager.js#L25
});

afterEach(() => {
  rootEl.remove();
});
