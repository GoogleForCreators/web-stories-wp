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

/**
 * Internal dependencies
 */
import activatePlugin from './activatePlugin';
import deactivatePlugin from './deactivatePlugin';

/**
 * Establishes test lifecycle to activate a given plugin
 * for the duration of the test.
 *
 * @param {string} slug Plugin slug.
 */
export default function withPlugin(slug) {
  beforeAll(async () => {
    await activatePlugin(slug);
  });

  afterAll(async () => {
    await deactivatePlugin(slug);
  });
}
