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

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma/fixture';
import { useStory } from '../../../../../app/story';
import { dataFontEm, dataPixels } from '../../../../../units';
import stripHTML from '../../../../../utils/stripHTML';
import { PRESETS } from '../textPresets';

describe('CUJ: Creator can Add and Write Text: Consecutive text presets', () => {
  let fixture;
  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should add text presets below each other if added consecutively', async () => {
    await fixture.editor.library.textTab.click();
    // @todo Remove this once #4094 gets fixed!
    // Wait until the history has changed to its initial (incorrect due to a bug) position.
    await fixture.events.sleep(300);

    await fixture.events.click(fixture.editor.library.text.preset('Heading 1'));
    await fixture.events.click(fixture.editor.library.text.preset('Heading 3'));
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));

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

    const verifyDefaultPosition = async (name, content) => {
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

    // @todo Remove this once #4094 gets fixed!
    // Wait until the history has changed to its initial (incorrect due to a bug) position.
    await fixture.events.sleep(500);

    // Stagger all different text presets.

    await fixture.events.click(fixture.editor.library.text.preset('Heading 1'));
    await verifyDefaultPosition('Heading 1', 'Heading 1');

    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await verifyStaggeredPosition(PARAGRAPH_TEXT);

    await fixture.events.click(fixture.editor.library.text.preset('Heading 2'));
    await verifyStaggeredPosition('Heading 2');

    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await verifyStaggeredPosition(PARAGRAPH_TEXT);

    await fixture.events.click(fixture.editor.library.text.preset('Heading 3'));
    await verifyStaggeredPosition('Heading 3');

    // Caption should be positioned in the default position again.
    await fixture.events.click(fixture.editor.library.text.preset('Caption'));
    await verifyDefaultPosition('Caption', 'Caption');

    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await verifyStaggeredPosition(PARAGRAPH_TEXT);

    await fixture.events.click(fixture.editor.library.text.preset('OVERLINE'));
    await verifyStaggeredPosition('OVERLINE');

    await fixture.snapshot('staggered all text presets');
  });
});
