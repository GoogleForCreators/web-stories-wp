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
 * External dependencies
 */
import { percySnapshot } from '@percy/puppeteer';

/**
 * Internal dependencies
 */
import {
  createNewStory,
  previewStory,
  insertStoryTitle,
  clickButton,
} from '../../../utils';

const MODAL = '.media-modal';

describe('Inserting WebM Video', () => {
  it('should insert an video by clicking on media dialog it', async () => {
    await createNewStory();

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    // Clicking will only act on the first element.
    await expect(page).toClick('button', { text: 'Upload' });

    await page.waitForSelector(MODAL, {
      visible: true,
    });

    await expect(page).toClick('button', { text: 'Media Library' });
    await clickButton(
      '.attachments-browser .attachments .attachment[aria-label="small-video"]'
    );
    await expect(page).toClick('button', { text: 'Insert into page' });

    await expect(page).toMatchElement('[data-testid="videoElement"]');

    // Wait for poster image to be generated.
    await page.waitForSelector('[alt="Preview poster image"]');
    await expect(page).toMatchElement('[alt="Preview poster image"]');

    await percySnapshot(page, 'Inserting Video from Dialog');
  });

  it('should insert an video by clicking on media library', async () => {
    await createNewStory();

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    await page.waitForSelector('[data-testid="mediaElement-video"]');
    // Clicking will only act on the first element.
    await expect(page).toClick('[data-testid="mediaElement-video"]');

    await page.waitForSelector('[data-testid="videoElement"]');
    await expect(page).toMatchElement('[data-testid="videoElement"]');

    // Wait for poster image to be generated.
    await page.waitForSelector('[alt="Preview poster image"]');
    await expect(page).toMatchElement('[alt="Preview poster image"]');

    await percySnapshot(page, 'Inserting Video from Media Library');
  });

  it('should insert an video by clicking on media library and preview on FE', async () => {
    await createNewStory();

    await insertStoryTitle('Publishing with video');

    await expect(page).not.toMatchElement('[data-testid="FrameElement"]');

    await page.waitForSelector('[data-testid="mediaElement-video"]');
    // Clicking will only act on the first element.
    await expect(page).toClick('[data-testid="mediaElement-video"]');

    await page.waitForSelector('[data-testid="videoElement"]');
    await expect(page).toMatchElement('[data-testid="videoElement"]');

    // Wait for poster image to be generated.
    await page.waitForSelector('[alt="Preview poster image"]');
    await expect(page).toMatchElement('[alt="Preview poster image"]');

    const editorPage = page;
    const previewPage = await previewStory(editorPage);
    await expect(previewPage).toMatchElement('amp-video');

    const poster = await previewPage.evaluate((selector) => {
      return document.querySelector(selector).getAttribute('poster');
    }, 'amp-video');

    // Check that the value of the poster is the url that is a string and not null.
    expect(poster).not.toBeNull();
    expect(poster).toStrictEqual(expect.any(String));
    expect(poster.endsWith('.jpeg')).toBeTrue();

    await editorPage.bringToFront();
    await previewPage.close();
  });
});
