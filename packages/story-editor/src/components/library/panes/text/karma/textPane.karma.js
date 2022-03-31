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
import { dataFontEm, dataPixels } from '@googleforcreators/units';
import { stripHTML } from '@googleforcreators/dom';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';
import { PRESETS } from '../textPresets';

const TIMEOUT_INTERVAL = 300000;

describe('CUJ: Creator can Add and Write Text: Consecutive text presets', () => {
  let fixture;
  let originalTimeout;

  beforeEach(async () => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    fixture.restore();
  });

  async function addPreset(name) {
    // Select background for being able to insert a text.
    await fixture.events.mouse.clickOn(
      fixture.editor.canvas.framesLayer.frames[0].node,
      '90%',
      '90%'
    );
    // Imitate the movement of real use to trigger the background processes while the user is moving the mouse.
    await fixture.events.mouse.moveRel(
      fixture.editor.library.text.preset(name),
      10,
      10,
      { steps: 2 }
    );
    await fixture.events.click(fixture.editor.library.text.preset(name));
  }

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  }

  describe('Adding text presets', () => {
    beforeEach(async () => {
      await fixture.editor.library.textTab.click();
      // Give some time for everything to be ready for the tests.
      await fixture.events.sleep(800);
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[0].node) {
          throw new Error('node not ready');
        }
      });
    });

    it('should add text preset via dragging from the preview', async () => {
      // Only background initially
      expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);

      const title = fixture.editor.library.text.preset('Title 1');
      const bgFrame = fixture.editor.canvas.framesLayer.frames[0].node;
      await fixture.events.mouse.seq(({ moveRel, down, up }) => [
        moveRel(title, 10, 10),
        down(),
        /* The steps give time for Moveable to react and display a clone to drag */
        moveRel(bgFrame, 50, 50, { steps: 20 }),
        up(),
      ]);
      // Now background + 1 extra element
      expect(fixture.editor.canvas.framesLayer.frames.length).toBe(2);
    });
  });

  describe('Applying text presets', () => {
    beforeEach(async () => {
      await fixture.editor.library.textTab.click();
      // Give some time for everything to be ready for the tests.
      await fixture.events.sleep(800);
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[0].node) {
          throw new Error('node not ready');
        }
      });
    });

    it('should apply Title preset to a label', async () => {
      // Only background initially
      expect(fixture.editor.canvas.framesLayer.frames.length).toBe(1);

      // Add label.
      await fixture.events.click(fixture.editor.library.text.preset('LABEL'));
      const [label] = await getSelection();
      expect(label.fontSize).toBe(12);

      // Apply Title 1.
      await fixture.events.click(
        fixture.editor.library.text.preset('Apply preset: Title 1')
      );
      // Verify the font size and font weight were applied.
      const [styledLabel] = await getSelection();
      expect(styledLabel.fontSize).toBe(36);
      expect(styledLabel.content).toBe(
        '<span style="font-weight: 700">LABEL</span>'
      );
    });

    it('should overwrite most of the styles but not text color when applying a preset', async () => {
      // Add label.
      await fixture.events.click(fixture.editor.library.text.preset('LABEL'));

      // Open style pane
      await fixture.events.click(fixture.editor.sidebar.designTab);
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.alignment.right
      );
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.textStyle.fill
      );

      const { italic, underline, letterSpacing, fontColor } =
        fixture.editor.sidebar.designPanel.textStyle;

      // First enter edit mode, select something, style it with all styles and exit edit mode
      await fixture.events.click(letterSpacing, { clickCount: 3 });
      await fixture.events.keyboard.type('50');
      await fixture.events.keyboard.press('Enter');
      await fixture.events.keyboard.press('Escape');
      await fixture.events.click(fontColor.hex, { clickCount: 3 });
      await fixture.events.keyboard.type('FFFFFF');
      await fixture.events.keyboard.press('Tab');
      await fixture.events.keyboard.press('Escape');
      await fixture.events.click(italic.button);
      await fixture.events.click(underline.button);

      const [label] = await getSelection();
      expect(label.content).toBe(
        '<span style="font-style: italic; text-decoration: underline; color: #fff; letter-spacing: 0.5em">LABEL</span>'
      );

      // Go to text tab in insert panel
      await fixture.events.click(fixture.editor.sidebar.insertTab);
      await fixture.editor.library.textTab.click();

      // Apply Title 1.
      await fixture.events.click(
        fixture.editor.library.text.preset('Apply preset: Title 1')
      );
      // Verify the style except for color was overwritten.
      const [styledLabel] = await getSelection();
      expect(styledLabel.fontSize).toBe(36);
      expect(styledLabel.content).toBe(
        '<span style="font-weight: 700; color: #fff">LABEL</span>'
      );
    });
  });

  describe('Adding texts consecutively', () => {
    beforeEach(async () => {
      await fixture.editor.library.textTab.click();
      // Give some time for everything to be ready for the tests.
      await fixture.events.sleep(800);
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[0].node) {
          throw new Error('node not ready');
        }
      });
    });

    it('should add text presets below each other if added consecutively', async () => {
      await fixture.events.mouse.moveRel(
        fixture.editor.library.text.preset('Title 1'),
        10,
        10
      );

      await waitFor(
        () => {
          if (!fixture.editor.library.text.textSets.length) {
            throw new Error('Text set not ready');
          }
          expect(fixture.editor.library.text.textSets.length).toBeGreaterThan(
            0
          );
        },
        { timeout: TIMEOUT_INTERVAL / 3 }
      );

      await addPreset('Title 1');
      await addPreset('Title 3');
      await addPreset('Paragraph');

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
        await waitFor(() => {
          if (!fixture.editor.canvas.framesLayer.frames[nodeIndex].node) {
            throw new Error('node not ready');
          }
          expect(
            fixture.editor.canvas.framesLayer.frames[nodeIndex].node
          ).toBeTruthy();
        });
        nodeIndex++;
        storyContext = await fixture.renderHook(() => useStory());
        let element = null;
        await waitFor(() => {
          element = storyContext.state.selectedElements[0];
          if (!element) {
            throw new Error('story not ready');
          }
          expect(stripHTML(element.content)).toEqual(content);
          const preset = PRESETS.find(({ title }) => name === title);
          expect(element.y).toEqual(dataPixels(preset.element.y));
        });
        nextY = element.y;
        nextHeight = element.height;
      };

      const verifyStaggeredPosition = async (content) => {
        await waitFor(() => {
          if (!fixture.editor.canvas.framesLayer.frames[nodeIndex].node) {
            throw new Error('node not ready');
          }
          expect(
            fixture.editor.canvas.framesLayer.frames[nodeIndex].node
          ).toBeTruthy();
        });
        nodeIndex++;
        // Store both last and next value to ensure incorrect value isn't used within waitFor.
        lastY = nextY;
        lastHeight = nextHeight;
        storyContext = await fixture.renderHook(() => useStory());
        let element = null;
        await waitFor(() => {
          element = storyContext.state.selectedElements[0];
          if (!element) {
            throw new Error('story not ready');
          }
          expect(stripHTML(element.content)).toEqual(content);
          expect(element.y).toEqual(
            dataPixels(lastY + lastHeight + POSITION_MARGIN)
          );
        });
        nextY = element.y;
        nextHeight = element.height;
      };
      await fixture.events.mouse.moveRel(
        fixture.editor.library.text.preset('Title 1'),
        10,
        10
      );

      await waitFor(
        () => {
          if (!fixture.editor.library.text.textSets.length) {
            throw new Error('text set not ready');
          }
          expect(fixture.editor.library.text.textSets.length).toBeTruthy();
        },
        {
          timeout: TIMEOUT_INTERVAL / 3,
        }
      );

      // Stagger all different text presets.
      await addPreset('Title 1');
      await verifyDefaultPosition('Title 1', 'Title 1');

      await addPreset('Paragraph');
      await verifyStaggeredPosition(PARAGRAPH_TEXT);

      await addPreset('Title 2');
      await verifyStaggeredPosition('Title 2');

      await addPreset('Paragraph');
      await verifyStaggeredPosition(PARAGRAPH_TEXT);

      // Title 3 should be positioned in the default position again.
      await addPreset('Title 3');
      await verifyStaggeredPosition('Title 3');

      await addPreset('Caption');
      await verifyStaggeredPosition('Caption');

      await addPreset('Paragraph');
      await verifyDefaultPosition('Paragraph', PARAGRAPH_TEXT);

      await addPreset('LABEL');
      await verifyStaggeredPosition('LABEL');

      await fixture.snapshot('staggered all text presets');
    });
  });

  describe('Easier/smarter text color', () => {
    it('should add text color based on background', async () => {
      await fixture.events.click(
        fixture.editor.canvas.quickActionMenu.changeBackgroundColorButton
      );
      await fixture.events.keyboard.type('000');
      await fixture.events.keyboard.press('Tab');

      // Enable the smart colors first.
      await fixture.events.click(fixture.editor.sidebar.insertTab);
      await fixture.editor.library.textTab.click();
      fixture.editor.library.text.smartColorToggle.click();

      // Should be added with white style on black background.
      await fixture.events.mouse.moveRel(
        fixture.editor.library.text.preset('Paragraph'),
        10,
        10
      );
      await fixture.events.sleep(800);
      // Select background for being able to insert another text.
      await fixture.events.mouse.clickOn(
        fixture.editor.canvas.framesLayer.frames[0].node,
        '90%',
        '90%'
      );
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(
        () => {
          if (!fixture.editor.canvas.framesLayer.frames[1].node) {
            throw new Error('node not ready');
          }
        },
        { timeout: 3000 }
      );

      const [text1] = await getSelection();
      expect(text1.content).toEqual(
        '<span style="color: #fff">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>'
      );

      // Select background for being able to insert another text.
      await fixture.events.mouse.clickOn(
        fixture.editor.canvas.framesLayer.frames[0].node,
        '90%',
        '90%'
      );
      await fixture.events.mouse.moveRel(
        fixture.editor.library.text.preset('Title 1'),
        10,
        10
      );
      await fixture.events.sleep(800);
      // Should be added with white style on black background.
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[2].node) {
          throw new Error('node not ready');
        }
      });
      const [title] = await getSelection();
      expect(title.content).toEqual(
        '<span style="font-weight: 700; color: #fff">Title 1</span>'
      );
    });
  });
});
