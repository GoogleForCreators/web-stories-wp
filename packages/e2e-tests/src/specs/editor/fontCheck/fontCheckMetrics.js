/*
 * Copyright 2022 Google LLC
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
  insertStoryTitle,
  publishStory,
  addRequestInterception,
} from '@web-stories-wp/e2e-test-utils';

async function createStoryWithTitle(title) {
  await createNewStory();
  await insertStoryTitle(title);
  await expect(page).toClick('#library-tab-text');
  const insertButton = await page.waitForXPath(
    `//button//span[contains(text(), 'Title 1')]`
  );
  await insertButton.click();
  await expect(page).toMatchElement('[data-testid="textFrame"]', {
    text: 'Title 1',
  });
}

async function updateFont(fontFamily) {
  // Open style pane
  await expect(page).toClick('li[role="tab"]', { text: /^Style$/ });
  await expect(page).toClick('button[aria-label="Font family"]');
  await page.keyboard.type(fontFamily);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
}

async function addStoryWithFont(title) {
  await createStoryWithTitle(title);
  await updateFont('Rock Salt');
  await publishStory();
  // Somehow reloading the page after creating the story here helps
  // with making the test more stable, i.e. toggling dev tools
  // works more reliably.
  await page.reload();
}

function isPlatformMacOS() {
  return page.evaluate(() => {
    const { platform } = window.navigator;
    return platform.includes('Mac') || ['iPad', 'iPhone'].includes(platform);
  });
}

async function toggleDevTools() {
  const areDevToolsOpen = Boolean(await page.$('#web-stories-editor textarea'));

  // Cancel whatever current action to ensure the below shortcut works.
  await page.keyboard.press('Escape');
  await page.click('[aria-label="Web Stories Editor"]');

  const isMacOS = await isPlatformMacOS();

  await page.keyboard.down(isMacOS ? 'Meta' : 'Control');
  await page.keyboard.down('Shift');
  await page.keyboard.down('Alt');
  await page.keyboard.down('J');
  await page.keyboard.up('J');
  await page.keyboard.up('Alt');
  await page.keyboard.up('Shift');
  await page.keyboard.down(isMacOS ? 'Meta' : 'Control');

  // Dev Tools were not open before, but now they should be open.
  if (!areDevToolsOpen) {
    await page.waitForSelector('#web-stories-editor textarea');
  }
}

async function getCurrentStoryData() {
  await toggleDevTools();

  const textareaContent = await page.evaluate(
    () => document.querySelector('#web-stories-editor textarea').value
  );

  await toggleDevTools();

  return JSON.parse(textareaContent);
}

describe('Font Check Metrics', () => {
  let stopRequestInterception;
  let mockResponse;

  jest.retryTimes(3, {logErrorsBeforeRetry: true});

  beforeAll(async () => {
    await page.setRequestInterception(true);
    stopRequestInterception = addRequestInterception((request) => {
      if (request.url().includes('web-stories/v1/fonts') && mockResponse) {
        request.respond(mockResponse);
        return;
      }

      request.continue();
    });
  });

  afterEach(() => {
    mockResponse = undefined;
  });

  afterAll(() => {
    stopRequestInterception();
  });

  it('should receive updated font metrics and not alter history', async () => {
    const storyTitle = 'Font Check Metrics';
    await addStoryWithFont(storyTitle);

    const storyData = await getCurrentStoryData();

    const fontBefore = storyData.pages[0].elements[1].font;
    expect(fontBefore.family).toBe('Rock Salt');
    expect(fontBefore.fallbacks).toIncludeAllMembers(['cursive']);
    expect(fontBefore.metrics.upm).toBe(1024);

    mockResponse = {
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          family: 'Rock Salt',
          fallbacks: ['sans-serif'], // Original is "cursive"
          weights: [900],
          styles: ['italic'],
          variants: [[0, 400]],
          service: 'fonts.google.com',
          metrics: {
            upm: 200, // Original is 1024
            asc: 1623,
            des: -788,
            tAsc: 824,
            tDes: -240,
            tLGap: 63,
            wAsc: 1623,
            wDes: 788,
            xH: 833,
            capH: 1154,
            yMin: -787,
            yMax: 1623,
            hAsc: 1623,
            hDes: -788,
            lGap: 32,
          },
        },
      ]),
    };

    await Promise.all([
      page.waitForResponse(
        (response) =>
          //eslint-disable-next-line jest/no-conditional-in-test -- False positive.
          response.url().includes('web-stories/v1/fonts') &&
          response.status() === 200
      ),
      page.reload(),
    ]);

    const newStoryData = await getCurrentStoryData();
    const fontAfter = newStoryData.pages[0].elements[1].font;
    expect(fontAfter.family).toBe('Rock Salt');
    expect(fontAfter.fallbacks).toIncludeAllMembers(['sans-serif']);
    expect(fontAfter.metrics.upm).toBe(200);

    await expect(page).toMatchElement(
      'button[aria-label="Undo Changes"][disabled]'
    );
    await expect(page).toMatchElement(
      'button[aria-label="Redo Changes"][disabled]'
    );
  });
});
