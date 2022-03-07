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
import { Fixture } from '../../../../../karma';

describe('Video Accessibility Panel', () => {
  let fixture;
  let vaPanel;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function focusOnTitle() {
    await fixture.events.click(vaPanel.panelTitle);
    await fixture.events.sleep(100);
    await fixture.events.click(vaPanel.panelTitle);
  }

  describe('CUJ: Creator Can Manipulate an Image/Video on Canvas: Set different poster image', () => {
    beforeEach(async () => {
      const mediaItem = fixture.editor.library.media.item(5);
      await fixture.events.mouse.clickOn(mediaItem, 20, 20); // item 5 is a video
      await fixture.events.click(fixture.editor.inspector.designTab);
      vaPanel = fixture.editor.inspector.designPanel.videoAccessibility;
    });

    it('should allow user to edit and reset poster image using mouse', async () => {
      // Remember original poster image
      const originalPoster = vaPanel.posterImage.src;

      vaPanel.posterMenuButton.scrollIntoView();

      // Expect menu button to exist
      expect(vaPanel.posterMenuButton).toBeTruthy();

      // Open the menu
      await fixture.events.click(vaPanel.posterMenuButton);
      await fixture.snapshot('Menu open');

      // And click on edit
      await fixture.events.click(vaPanel.posterMenuEdit);

      // Expect poster image to have updated ( See MediaUpload component in fixture.js )
      expect(vaPanel.posterImage.src).toMatch(/^http.+\/saturn.jpg$/);

      // Now open menu and click reset
      await fixture.events.click(vaPanel.posterMenuButton);
      await fixture.events.click(vaPanel.posterMenuReset);

      // Expect poster image to have been reset
      expect(vaPanel.posterImage.src).toBe(originalPoster);
    });

    it('should allow user to edit and reset poster image using keyboard', async () => {
      // Remember original poster image
      const originalPoster = vaPanel.posterImage.src;

      // Ensure focus right before the menu button.
      vaPanel.panelTitle.scrollIntoView();
      await focusOnTitle();

      // Expect menu button to exist
      expect(vaPanel.posterMenuButton).toBeTruthy();
      await fixture.snapshot('Menu button visible');

      // Tab to the menu button to focus on it.
      await fixture.events.keyboard.press('tab');
      expect(vaPanel.posterMenuButton).toHaveFocus();

      await fixture.events.keyboard.press('Enter');
      expect(vaPanel.posterMenuEdit).toBeDefined();
      await fixture.snapshot('Menu open');

      // And click on edit
      expect(vaPanel.posterMenuEdit).toHaveFocus();
      await fixture.events.keyboard.press('Enter');

      // Expect poster image to have updated ( See MediaUpload component in fixture.js )
      expect(vaPanel.posterImage.src).toMatch(/^http.+\/saturn.jpg$/);

      // Now open menu and click reset
      await focusOnTitle();
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('down');
      expect(vaPanel.posterMenuReset).toHaveFocus();
      await fixture.events.keyboard.press('Enter');

      // Expect poster image to have been reset
      expect(vaPanel.posterImage.src).toBe(originalPoster);
    });
  });
});
