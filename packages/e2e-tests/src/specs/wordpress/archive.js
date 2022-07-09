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
 * External dependencies
 */
import {
  createNewPost,
  insertBlock,
  insertWidget,
  minWPVersionRequired,
  publishPost,
  visitAdminPage,
  visitBlockWidgetScreen,
  visitSettings,
  withPlugin,
  createURL,
  trashAllPosts,
  setPostContent,
} from '@web-stories-wp/e2e-test-utils';

const pageTitle = 'Web Stories Archive';
const pageContent = 'Web Stories archive content';
const pageInput = 'input[placeholder="Select page"]';
const saveMessage = 'Setting saved.';

const changeStoriesArchivesType = async (option) => {
  await visitSettings();
  await expect(page).toClick('button[aria-label="Stories Archives"]');
  await expect(page).toClick('li[role="option"]', { text: option });
  await page.waitForResponse(
    (response) =>
      response.url().includes('web-stories/v1/settings') &&
      response.status() === 200
  );
  await expect(page).toMatchElement('[role="alert"]', {
    text: saveMessage,
  });
};

// TODO(#9636): Fix flakey test.
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Stories Archive', () => {
  describe('Custom Page', () => {
    beforeAll(async () => {
      await createNewPost({
        showWelcomeGuide: false,
        postType: 'page',
        title: pageTitle,
      });
      await setPostContent(pageContent);
      await publishPost();
    });

    afterAll(async () => {
      await changeStoriesArchivesType('Default');
      await trashAllPosts('page');
    });

    it('should select a custom page', async () => {
      await visitSettings();
      await changeStoriesArchivesType('Custom');
      await expect(page).toMatchElement(pageInput);
      await page.type(pageInput, pageTitle);
      await expect(page).toMatchElement('li[role="option"]', {
        text: pageTitle,
      });
      await expect(page).toClick('li[role="option"]', {
        text: pageTitle,
      });
      await page.waitForResponse(
        (response) =>
          //eslint-disable-next-line jest/no-conditional-in-test
          response.url().includes('web-stories/v1/settings') &&
          response.status() === 200
      );
      await expect(page).toMatchElement('[role="alert"]', {
        text: saveMessage,
      });

      const archiveLink = createURL('web-stories');
      await page.goto(archiveLink, {
        waitUntil: 'networkidle2',
      });

      await expect(page).toMatch(pageContent);
    });
  });

  // eslint-disable-next-line jest/no-disabled-tests
  describe.skip('Disabled', () => {
    beforeAll(async () => {
      await changeStoriesArchivesType('Disabled');
    });
    afterAll(async () => {
      await changeStoriesArchivesType('Default');
    });

    describe('Block', () => {
      it('should insert a new web stories block', async () => {
        await createNewPost({
          showWelcomeGuide: false,
        });
        await insertBlock('Web Stories');
        await page.waitForSelector('.web-stories-block-configuration-panel');

        await expect(page).toClick('button', { text: 'Latest Stories' });
        await expect(page).toClick('button', { text: 'Box Carousel' });
        await expect(page).not.toMatchElement('label', {
          text: 'Display Archive Link',
        });
      });
    });

    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('Widget Block', () => {
      minWPVersionRequired('5.8');
      it('should insert a new web stories block', async () => {
        await visitBlockWidgetScreen();
        await expect(page).toClick('button[aria-label="Add block"]');
        await page.type('.block-editor-inserter__search-input', 'Web Stories');
        await expect(page).toClick('button span', { text: 'Web Stories' });

        await page.waitForSelector('.web-stories-block-configuration-panel');
        await expect(page).toClick('.web-stories-block-configuration-panel');

        await expect(page).toClick('button', { text: 'Latest Stories' });
        await expect(page).toClick('button', { text: 'Box Carousel' });
        await expect(page).not.toMatchElement('label', {
          text: 'Display Archive Link',
        });
      });
    });

    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('Widget', () => {
      withPlugin('classic-widgets');

      it('should be able to add widget', async () => {
        await visitAdminPage('widgets.php');

        await insertWidget('Web Stories');
        await expect(page).toMatchElement(
          '.widget-liquid-right .web-stories-field-wrapper'
        );
        await expect(page).not.toMatchElement('label', {
          text: 'Display Archive Link',
        });
      });
    });
  });
});
