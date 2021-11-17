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
import { getCurrentUser, setCurrentUser } from './user';

/**
 * Establishes test lifecycle to enforce a specific user to be logged in.
 *
 * @param {string} username Username.
 * @param {string} password Password.
 */
export default function withUser(username, password) {
  const currentUser = getCurrentUser();

  /* eslint-disable jest/require-top-level-describe, require-await */
  beforeAll(async () => setCurrentUser(username, password));

  afterAll(async () =>
    setCurrentUser(currentUser.username, currentUser.password)
  );
  /* eslint-enable jest/require-top-level-describe, require-await */
}
