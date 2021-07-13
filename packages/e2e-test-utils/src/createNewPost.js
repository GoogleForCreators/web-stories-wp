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
import { addQueryArgs } from '@wordpress/url';
/**
 * Internal dependencies
 */

import visitAdminPage from './visitAdminPage';
/**
 * Creates new post.
 *
 * @param {Object}  object                    Object to create new post, along with tips enabling option.
 * @param {string}  [object.postType]         Post type of the new post.
 * @param {string}  [object.title]            Title of the new post.
 * @param {string}  [object.content]          Content of the new post.
 * @param {string}  [object.excerpt]          Excerpt of the new post.
 * @param {boolean} [object.showWelcomeGuide] Whether to show the welcome guide.
 */
async function createNewPost({
  postType,
  title,
  content,
  excerpt,
  showWelcomeGuide = false,
} = {}) {
  const query = addQueryArgs('', {
    post_type: postType,
    post_title: title,
    content,
    excerpt,
  }).slice(1);
  await visitAdminPage('post-new.php', query);
  await page.waitForSelector('.edit-post-layout');
  const isWelcomeGuideActive = await page.evaluate(() =>
    wp.data.select('core/edit-post').isFeatureActive('welcomeGuide')
  );
  const isFullscreenMode = await page.evaluate(() =>
    wp.data.select('core/edit-post').isFeatureActive('fullscreenMode')
  );

  if (showWelcomeGuide !== isWelcomeGuideActive) {
    await page.evaluate(() =>
      wp.data.dispatch('core/edit-post').toggleFeature('welcomeGuide')
    );
    await page.reload();
    await page.waitForSelector('.edit-post-layout');
  }

  if (isFullscreenMode) {
    await page.evaluate(() =>
      wp.data.dispatch('core/edit-post').toggleFeature('fullscreenMode')
    );
    await page.waitForSelector('body:not(.is-fullscreen-mode)');
  }
}
export default createNewPost;
