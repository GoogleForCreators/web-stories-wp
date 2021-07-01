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
import { waitFor } from '@testing-library/react';
import { dataFontEm, dataPixels } from '@web-stories-wp/units';
/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma/fixture';
import { useStory } from '../../../../../app/story';
import stripHTML from '../../../../../utils/stripHTML';
import { PRESETS } from '../textPresets';
import { BACKGROUND_TEXT_MODE } from '../../../../../constants';

const TIMEOUT_INTERVAL = 300000;

describe('CUJ: Creator can Add and Write Text: Consecutive text presets', () => {
  let fixture;
  let originalTimeout;

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    fixture.restore();
  });

  it('should add text presets below each other if added consecutively', async () => {
    await fixture.editor.library.textTab.click();

    await waitFor(
      () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
      { timeout: TIMEOUT_INTERVAL / 3 }
    );

    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    await fixture.events.click(fixture.editor.library.text.preset('Title 3'));
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => fixture.editor.canvas.framesLayer.frames[3].node);

    await fixture.snapshot('consecutively added different text presets');
  });

  it('should ensure staggered presets fit on the page', async () => {
    const POSITION_MARGIN = dataFontEm(1);
    const PARAGRAPH_TEXT =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    let lastY;
    let lastHeight;
    let nextY;
    let nextHeight;
    let storyContext;
    let nodeIndex = 1;

    const verifyDefaultPosition = async (name, content) => {
      await waitFor(
        () => fixture.editor.canvas.framesLayer.frames[nodeIndex].node
      );
      nodeIndex++;
      storyContext = await fixture.renderHook(() => useStory());
      const element = storyContext.state.selectedElements[0];
      await waitFor(() => {
        expect(stripHTML(element.content)).toEqual(content);
        const preset = PRESETS.find(({ title }) => name === title);
        expect(element.y).toEqual(dataPixels(preset.element.y));
      });
      nextY = element.y;
      nextHeight = element.height;
    };

    const verifyStaggeredPosition = async (content) => {
      await waitFor(
        () => fixture.editor.canvas.framesLayer.frames[nodeIndex].node
      );
      nodeIndex++;
      // Store both last and next value to ensure incorrect value isn't used within waitFor.
      lastY = nextY;
      lastHeight = nextHeight;
      storyContext = await fixture.renderHook(() => useStory());
      const element = storyContext.state.selectedElements[0];
      await waitFor(() => {
        expect(stripHTML(element.content)).toEqual(content);
        expect(element.y).toEqual(
          dataPixels(lastY + lastHeight + POSITION_MARGIN)
        );
      });
      nextY = element.y;
      nextHeight = element.height;
    };

    await fixture.editor.library.textTab.click();

    await waitFor(
      () => expect(fixture.editor.library.text.textSets.length).toBeTruthy(),
      {
        timeout: TIMEOUT_INTERVAL / 3,
      }
    );

    // Stagger all different text presets.
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    await verifyDefaultPosition('Title 1', 'Title 1');

    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await verifyStaggeredPosition(PARAGRAPH_TEXT);

    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));
    await verifyStaggeredPosition('Title 2');

    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await verifyStaggeredPosition(PARAGRAPH_TEXT);

    // Title 3 should be positioned in the default position again.
    await fixture.events.click(fixture.editor.library.text.preset('Title 3'));
    await verifyStaggeredPosition('Title 3');

    await fixture.events.click(fixture.editor.library.text.preset('Caption'));
    await verifyStaggeredPosition('Caption');

    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await verifyDefaultPosition('Paragraph', PARAGRAPH_TEXT);

    await fixture.events.click(fixture.editor.library.text.preset('LABEL'));
    await verifyStaggeredPosition('LABEL');

    await fixture.snapshot('staggered all text presets');
  });

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  describe('Easier/smarter text color', () => {
    it('should add text color based on background', async () => {
      await fixture.events.click(fixture.screen.getByTestId('FramesLayer'));
      await fixture.events.click(
        fixture.editor.inspector.designPanel.pageBackground.backgroundColorInput
      );
      await fixture.events.keyboard.type('000');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      const [text] = await getSelection();
      expect(text.content).toEqual(
        '<span style="color: #fff">Fill in some text</span>'
      );

      // The next text should have white highlight and black color since it's placed on top of the previous white text.
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[2].node);

      const [text2] = await getSelection();
      expect(text2.content).toEqual('Fill in some text');
      expect(text2.backgroundTextMode).toEqual(BACKGROUND_TEXT_MODE.HIGHLIGHT);
      expect(text2.backgroundColor).toEqual({
        color: { r: 255, g: 255, b: 255, a: 1 },
      });
    });
  });
});
