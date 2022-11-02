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
  publishPost,
  visitAdminPage,
  visitBlockWidgetScreen,
  visitSettings,
  withPlugin,
  createURL,
  trashAllPosts,
  setPostContent,
  deleteWidgets,
  activatePlugin,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import { addAllowedErrorMessage } from '../../config/bootstrap';

const pageTitle = 'Web Stories Archive';
const pageContent = 'Web Stories archive content';

/**
 * Change archives page type.
 *
 * @param {string} option Archive type to select.
 * @return {Promise<void>}
 */
const changeStoriesArchivesType = async (option) => {
  await expect(page).toClick('button[aria-label="Stories Archives"]');
  await expect(page).toClick('li[role="option"]', { text: option });
  await page.waitForResponse(
    (response) =>
      response.url().includes('web-stories/v1/settings') &&
      response.status() === 200
  );
  await expect(page).toMatchElement('[role="alert"]', {
    text: 'Setting saved.',
  });
};

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Stories Archive', () => {
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
      await visitSettings();
      await changeStoriesArchivesType('Default');
      await trashAllPosts();
      await trashAllPosts('page');
    });

    it('should select a custom page', async () => {
      await visitSettings();
      await changeStoriesArchivesType('Create your own');
      await expect(page).toMatchElement('input[placeholder="Select page"]');
      await page.type('input[placeholder="Select page"]', pageTitle);
      await expect(page).toMatchElement('li[role="option"]', {
        text: pageTitle,
      });
      await Promise.all([
        expect(page).toClick('li[role="option"]', {
          text: pageTitle,
        }),
        page.waitForResponse(
          (response) =>
            //eslint-disable-next-line jest/no-conditional-in-test
            response.url().includes('web-stories/v1/settings') &&
            response.status() === 200
        ),
      ]);
      await expect(page).toMatchElement('[role="alert"]', {
        text: 'Setting saved.',
      });
      const archiveLink = createURL('web-stories');
      await page.goto(archiveLink, {
        waitUntil: 'networkidle2',
      });
      await expect(page).toMatch(pageContent);
    });
  });

  describe('Disabled', () => {
    beforeAll(async () => {
      await visitSettings();
      await changeStoriesArchivesType('Disabled');
    });
    afterAll(async () => {
      await visitSettings();
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

    describe('Widget Block', () => {
      let removeErrorMessage;

      beforeAll(() => {
        // Caused by the NotEmpty component in wp-includes/js/dist/widgets.js.
        removeErrorMessage = addAllowedErrorMessage(
          "Can't perform a React state update on an unmounted component"
        );
      });

      beforeEach(async () => {
        await deleteWidgets();
      });

      afterEach(async () => {
        await deleteWidgets();
      });

      afterAll(() => {
        removeErrorMessage();
      });

      it('should not show archive link option', async () => {
        await visitBlockWidgetScreen();

        await expect(page).toClick('button[aria-label="Add block"]');

        await page.type('input[type="search"]', 'Web Stories');
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

    describe('Widget', () => {
      withPlugin('classic-widgets');

      beforeEach(async () => {
        await deleteWidgets();
        await activatePlugin('classic-widgets');
      });

      afterEach(async () => {
        await deleteWidgets();
      });

      it('should not show archive link option', async () => {
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
