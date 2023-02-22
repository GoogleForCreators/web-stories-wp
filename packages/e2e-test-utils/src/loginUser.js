/*
 * Copyright 2021 Google LLC
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
import createURL from './createURL';
import isCurrentURL from './isCurrentURL';

/**
 * Performs log in with specified username and password.
 *
 * @param {?string} username String to be used as user credential.
 * @param {?string} password String to be used as user credential.
 */
async function loginUser(username, password) {
  if (!isCurrentURL('wp-login.php')) {
    await page.goto(createURL('wp-login.php'));
  }

  // Puppeteer appears to sometimes have issues with typing,
  // where the first 1-2 characters are simply not typed.
  // Hence not using page.type() as one would typically use.
  // Should be OK since there are no event listeners on the login form.
  // See https://github.com/puppeteer/puppeteer/issues/1648

  await page.evaluate(
    (value) => (document.getElementById('user_login').value = value),
    username
  );
  await page.evaluate(
    (value) => (document.getElementById('user_pass').value = value),
    password
  );

  await Promise.all([page.waitForNavigation(), page.click('#wp-submit')]);

  await expect(page).not.toMatchElement('#login_error', {
    text: /Unknown username/i,
  });
}

export default loginUser;
