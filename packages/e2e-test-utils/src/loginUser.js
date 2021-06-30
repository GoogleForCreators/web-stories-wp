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
 * WordPress dependencies
 */
import { createURL, isCurrentURL } from '@wordpress/e2e-test-utils';

/**
 * Performs log in with specified username and password.
 *
 * Sets username and password in login form with some extra hardening.
 *
 * Puppeteer appears to sometimes have issues with typing,
 * where the first 1-2 characters are simply not typed.
 *
 * At the same time, there can be an issue where the password is not actually
 * submitted (not part of the form data) when trying to log in.
 *
 * Hence not using only `page.type()` as one would typically use, but instead
 * using two methods just to be safe.
 *
 * The matchers at the end try to catch any errors where form submission
 * is incomplete for some reason.
 *
 * @see https://github.com/puppeteer/puppeteer/issues/1648
 * @param {?string} username String to be used as user credential.
 * @param {?string} password String to be used as user credential.
 */
async function loginUser(username, password) {
  if (!isCurrentURL('wp-login.php')) {
    await page.goto(createURL('wp-login.php'));
  }

  const cookies = (await page.cookies())
    .filter((cookie) => Boolean(cookie?.name?.startsWith('wordpress_')))
    .map((cookie) => cookie.name);
  for (const cookie of cookies) {
    //eslint-disable-next-line no-await-in-loop
    await page.deleteCookie(cookie);
  }

  await page.evaluate(() => (document.getElementById('user_login').value = ''));
  await page.evaluate(() => (document.getElementById('user_pass').value = ''));

  await page.focus('#user_login');
  await page.type('#user_login', username);
  await page.focus('#user_pass');
  await page.type('#user_pass', password);

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
    text: /Password field is empty/i,
  });

  await expect(page).not.toMatchElement('#login_error', {
    text: /Username field is empty/i,
  });

  await expect(page).not.toMatchElement('#login_error', {
    text: /Unknown username/i,
  });

  await expect(page).not.toMatchElement('#login_error', {
    text: /Error:/i,
  });
}

export default loginUser;
