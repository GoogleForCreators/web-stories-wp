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
import { useStory } from '@googleforcreators/story-editor';

describe('Video Options Panel', () => {
  let fixture;
  let vaPanel;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ videoVolume: true });
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

  describe('CUJ: Creator Can Manipulate an Video on Canvas: Set different video options', () => {
    beforeEach(async () => {
      const mediaItem = fixture.editor.library.media.item(5);
      await fixture.events.mouse.clickOn(mediaItem, 20, 20); // item 5 is a video
      await fixture.events.click(fixture.editor.sidebar.designTab);
      vaPanel = fixture.editor.sidebar.designPanel.videoOptions;
    });

    it('should allow user to edit volume using mouse', async () => {
      vaPanel.volume.scrollIntoView();

      // Expect menu button to exist
      expect(vaPanel.volume).toBeTruthy();

      await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
        moveRel(vaPanel.volume, 1, 1),
        down(),
        moveBy(10, 0, { steps: 2 }),
        up(),
      ]);
      // Click just below the slider to exit edit mode
      await fixture.events.mouse.clickOn(vaPanel.volume, 0, 20);

      await fixture.events.sleep(300);
      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].volume).toBe( 0.1 );
    });


    it('should allow user to edit volume using keyboard', async () => {
         // Ensure focus right before the menu button.
      vaPanel.panelTitle.scrollIntoView();
      await focusOnTitle();

      // Expect menu button to exist
      vaPanel.volume.scrollIntoView();

      // Expect menu button to exist
      expect(vaPanel.volume).toBeTruthy();

      // Tab to the menu button to focus on it.
      await fixture.events.keyboard.press('tab');
      await fixture.events.keyboard.press('tab');
      expect(vaPanel.volume).toHaveFocus();
      await fixture.events.keyboard.press('left');
      await fixture.events.keyboard.press('left');
      await fixture.events.keyboard.press('left');

      await fixture.events.sleep(300);
      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].volume).toBe( 0.7 );
    });
  });
});
