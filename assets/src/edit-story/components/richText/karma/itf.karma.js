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
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';

describe('Background Overlay Panel', () => {
  let fixture;
  let bgId, textId;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    // Add new text
    const addText = fixture.screen.getByLabelText(/Add new text element/i);
    await fixture.events.click(addText);

    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    bgId = elements[0].id;
    textId = elements[1].id;
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should have the correct initial text', async () => {
    expect(await getTextContent()).toBe('Fill in some text');
  });

  it('should have new text when replacing it', async () => {
    await enterEditMode();
    await fixture.events.keyboard.type('A new text');
    await exitEditMode();

    expect(await getTextContent()).toBe('A new text');
  });

  describe('when the text is bolded', () => {
    beforeEach(async () => {
      // Click bold('s parent element, as bold is a hidden input)
      const bold = fixture.screen.getByLabelText(/Toggle: bold/i);
      await fixture.events.click(bold.parentElement);
    });

    it('should have the correct text', async () => {
      expect(await getTextContent()).toBe(
        '<span style="font-weight: 700">Fill in some text</span>'
      );
    });

    it('should still be bold when text is replaced', async () => {
      await enterEditMode();
      await fixture.events.keyboard.type('A new text');
      await exitEditMode();

      expect(await getTextContent()).toBe(
        '<span style="font-weight: 700">A new text</span>'
      );
    });

    it('should also still be bold when text is removed, then replaced', async () => {
      await enterEditMode();
      await fixture.events.keyboard.shortcut('Backspace');
      await fixture.events.keyboard.type('Even more text');
      await exitEditMode();

      expect(await getTextContent()).toBe(
        '<span style="font-weight: 700">Even more text</span>'
      );
    });
  });

  async function enterEditMode() {
    // Click the background
    await clickElement(bgId);

    // Then click the text field
    await clickElement(textId);

    // And then press "enter" (will enter edit mode and select everything)
    await fixture.events.keyboard.shortcut('Enter');
  }

  async function exitEditMode() {
    // Press "Escape" to exit
    await fixture.events.keyboard.shortcut('Escape');
  }

  async function clickElement(elementId) {
    const frame = fixture.editor.canvas.framesLayer.frame(elementId).node;
    await fixture.events.mouse.clickOn(frame, 1, 1);
  }

  async function getTextContent() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements[1].content;
  }
});
