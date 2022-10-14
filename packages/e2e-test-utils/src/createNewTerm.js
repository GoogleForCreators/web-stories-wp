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
import visitAdminPage from './visitAdminPage';

/**
 * Creates a new term in a given taxonomy.
 *
 * @param {string} taxonomy Taxonomy name
 * @param {string} term Term name.
 * @param {string} [parent] Parent term name.
 */
async function createNewTerm(taxonomy, term, parent) {
  await visitAdminPage('edit-tags.php', `taxonomy=${taxonomy}`);

  await expect(page).toMatchElement('input#tag-name');
  await page.type('input#tag-name', term);

  if (parent) {
    await expect(page).toSelect('#parent', parent);
  }

  await page.click('#submit');

  await expect(page).toMatchElement('td.slug', {
    text: term.replaceAll(' ', '-'),
  });
}

export default createNewTerm;
