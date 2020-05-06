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
import { createNewStory, exportData, popStats } from '../../utils';

// To debug:
// 1. Set `PUPPETEER_DEVTOOLS=true`
// 2. Insert `await jestPuppeteer.debug()` in the test being debugged.

describe('Selection with new element', () => {
  let safezoneBox;
  let errors;

  beforeEach(async () => {
    await createNewStory();

    errors = [];
    page.on('error', (error) => {
      errors.push({cat: 'error', error});
    });
    page.on('pageerror', (error) => {
      errors.push({cat: 'pageerror', error});
    });

    // Click on a first media image.
    await expect(page).toClick('[data-testid="mediaElement"] img');

    // Find and measure the safe zone.
    const safezone = await expect(page).toMatchElement('[data-testid="FramesLayer"] [data-testid="safezone"]');
    safezoneBox = await safezone.boundingBox();
  });

  afterEach(() => {
    expect(errors).toHaveLength(0);
  });

  it('should auto-select, unselect, and reselect via lasso', async () => {
    const iniStoryState = await exportData(page, 'StoryProvider');
    expect(iniStoryState.selectedElements).toHaveLength(1);
    const {id: elementId, width, height, x, y} = iniStoryState.selectedElements[0];

    // Find and measure the frame.
    const frame = await expect(page).toMatchElement(`[data-testid="frame"][data-element-id="${elementId}"]`);
    const box = await frame.boundingBox();

    // Check that the measurements match the element's data.
    expect(box.width).toBe(width);
    expect(box.height).toBe(height);
    expect(box.x - safezoneBox.x).toBe(x);
    expect(box.y - safezoneBox.y).toBe(y);
    await popStats(page);

    // Unselect: move mouse just outside the safe zone and do mouse down.
    await page.mouse.move(safezoneBox.x - 5, box.y);
    await page.mouse.down();
    const unselectedStoryState = await exportData(page, 'StoryProvider');
    expect(unselectedStoryState.selectedElements).toHaveLength(0);
    const unselectedStats = await popStats(page);
    expect(unselectedStats.changed).toEqual(['StoryProvider']);

    // Use lasso.
    await page.mouse.move(box.x + 5, box.y + 5, {steps: 10});
    await page.mouse.up();
    const lassoSelectedStoryState = await exportData(page, 'StoryProvider');
    expect(lassoSelectedStoryState.selectedElements).toHaveLength(1);
    expect(lassoSelectedStoryState.selectedElements[0].id).toBe(elementId);
    const lassoSelectedStats = await popStats(page);
    expect(lassoSelectedStats.changed).toEqual(['StoryProvider']);
  });
});
