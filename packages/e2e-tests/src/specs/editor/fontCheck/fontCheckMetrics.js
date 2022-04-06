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
}

describe('Font Check Metrics', () => {
  let stopRequestInterception;
  let mockResponse;

  beforeAll(async () => {
    await page.setRequestInterception(true);
    stopRequestInterception = addRequestInterception((request) => {
      if (request.url().includes('/v1/fonts/') && mockResponse) {
        request.respond(mockResponse);
        return;
      }

      request.continue();
    });
  });

  afterAll(async () => {
    await page.setRequestInterception(false);
    stopRequestInterception();
  });

  it('should receive updated font metrics and not alter history', async () => {
    const storyTitle = 'Font Check Metrics';
    await addStoryWithFont(storyTitle);
    const textElBefore = await expect(page).toMatchElement('p', {
      text: 'Title 1',
    });
    const fontFamilyBefore = await page.evaluate(
      (el) => getComputedStyle(el).font,
      textElBefore
    );
    expect(fontFamilyBefore).toContain('Rock Salt');
    expect(fontFamilyBefore).toContain('cursive');

    mockResponse = [
      {
        family: 'Rock Salt',
        fallbacks: ['sans-serif'],
        weights: [900],
        styles: ['italic'],
        variants: [[0, 400]],
        service: 'fonts.google.com',
        metrics: {
          upm: 200,
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
    ];

    // force load updated metrics
    await page.keyboard.down('Meta');
    await page.keyboard.down('Alt');
    await page.keyboard.down('Shift');
    await page.keyboard.down('J');

    const devToolsContent = {
      current: 'debe7429-673b-40dd-aeaf-5a495ed90ac6',
      selection: ['cdf47c87-385c-4485-b114-9bb608e535cd'],
      story: {
        globalStoryStyles: {
          colors: [],
          textStyles: [],
        },
      },
      version: 41,
      pages: [
        {
          elements: [
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              x: 1,
              y: 1,
              width: 1,
              height: 1,
              mask: {
                type: 'rectangle',
              },
              isBackground: true,
              isDefaultBackground: true,
              type: 'shape',
              id: '6a1ffee7-f740-4691-9e01-eef62d6b31bf',
            },
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              backgroundTextMode: 'NONE',
              font: {
                family: 'Rock Salt',
                fallbacks: ['sans-serif'],
                weights: [400],
                styles: ['regular'],
                variants: [[0, 400]],
                service: 'fonts.google.com',
                metrics: {
                  upm: 1024,
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
              fontSize: 36,
              backgroundColor: {
                color: {
                  r: 196,
                  g: 196,
                  b: 196,
                },
              },
              lineHeight: 1.19,
              textAlign: 'left',
              padding: {
                locked: true,
                hasHiddenPadding: false,
                horizontal: 0,
                vertical: 0,
              },
              type: 'text',
              content: 'Title 1',
              borderRadius: {
                locked: true,
                topLeft: 2,
                topRight: 2,
                bottomRight: 2,
                bottomLeft: 2,
              },
              x: 40,
              y: 291,
              width: 186,
              height: 85,
              scale: 100,
              focalX: 50,
              focalY: 50,
              id: 'cdf47c87-385c-4485-b114-9bb608e535cd',
            },
          ],

          type: 'page',
          id: 'debe7429-673b-40dd-aeaf-5a495ed90ac6',
        },
      ],
    };

    await page.$eval(
      'textArea[class^="devTools__Textarea"]',
      (el, value) => (el.value = value),
      JSON.stringify(devToolsContent, null, 4)
    );
    // this will be removed --- adding to verify the content was loaded
    await page.waitForTimeout(10000);
    await expect(page).toClick('[title="Load data from input"]');
    // this will be removed --- verifying what happens after load is pressed
    await page.waitForTimeout(10000);
    const textElAfter = await expect(page).toMatchElement('p', {
      text: 'Title 1',
    });

    const fontFamilyAfter = await page.evaluate(
      (el) => getComputedStyle(el).font,
      textElAfter
    );
    expect(fontFamilyAfter).toContain('Rock Salt');
    expect(fontFamilyAfter).toContain('sans-serif');
    await expect(page).toMatchElement(
      'button[aria-label="Undo Changes" disabled]'
    );
    await expect(page).toMatchElement(
      'button[aria-label="Redo Changes" disabled]'
    );
  });
});
