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
import {
    createNewStory,
} from '@web-stories-wp/e2e-test-utils';

describe('Floating Menu', () => {
    beforeEach(async () => {
        await createNewStory();

        // Wait for title input to load before continuing.
        await page.waitForSelector('input[placeholder="Add title"]');


        // Wait for skeleton thumbnails in the carousel to render which gives footer time to also render
        await page.waitForFunction(
            () =>
                !document.querySelector(
                    'li[data-testid^="carousel-page-preview-skeleton"]'
                ),
            { timeout: 10000 } // requestIdleCallback in the carousel kicks in after 5s the latest.
        );
    });

    it('should display text floating menu', async () => {
        // Open a text tab
        await expect(page).toClick('#library-tab-text');

        // Add a paragraph
        await expect(page).toClick('button[data-testid="preview-text"] span', {
            text: /^Paragraph/,
        });

        // Floating menu should show up
        await expect(page).toMatchElement('div[data-testid="context-menu-list"]');
    });

    it('should display media floating menu', async () => {
        // Open a media tab
        await expect(page).toClick('#library-tab-media');

        // Add a media item
        await expect(page).toClick('div[data-testid="mediaElement-image"]:first-child button');

        const insertButton = await page.waitForXPath(
            `//li//span[contains(text(), 'Insert image')]`
        );
        await insertButton.click();

        // Floating menu should show up
        await expect(page).toMatchElement('div[data-testid="context-menu-list"]');
    });

    it('should display media3p floating menu', async () => {
        // Open a media3p tab
        await expect(page).toClick('#library-tab-media3p');

        // Add a media3p item
        await expect(page).toClick('div[data-testid="mediaElement-image"]:first-child button');
        const insertButton = await page.waitForXPath(
            `//li//span[contains(text(), 'Insert image')]`
        );
        await insertButton.click();

        // Floating menu should show up
        await expect(page).toMatchElement('div[data-testid="context-menu-list"]');
    });

    it('should display shapes floating menu', async () => {
        // Open a shapes tab
        await expect(page).toClick('#library-tab-shapes');

        // Add a shape
        await expect(page).toClick('div[data-testid="shapes-library-pane"] div:first-child');

        // Floating menu should show up
        await expect(page).toMatchElement('div[data-testid="context-menu-list"]');
    });
});
