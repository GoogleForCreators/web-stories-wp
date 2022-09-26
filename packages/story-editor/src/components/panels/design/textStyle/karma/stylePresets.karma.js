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
import { Fixture } from '../../../../../karma';
import { useStory } from '../../../../../app/story';
import { DEFAULT_PRESET } from '../../../../library/panes/text/textPresets';

describe('Panel: Style Presets', () => {
  let fixture;
  let panel;

  const selectTarget = async (target) => {
    await fixture.events.keyboard.down('Shift');
    await fixture.events.mouse.seq(({ moveRel, down, up }) => [
      moveRel(target, 10, 10),
      down(),
      up(),
    ]);
    await fixture.events.keyboard.up('Shift');
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
    localStorage.clear();
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Save Text Style', () => {
    it('should allow adding new text style from a text element', async () => {
      await fixture.editor.library.textTab.click();

      // Verify that no styles are added currently.
      const noStylesText = fixture.screen.getByText('No Styles Saved');
      expect(noStylesText).toBeDefined();

      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });

      await fixture.events.click(fixture.editor.sidebar.designTab);
      // Click to add a style and verify it was added.
      panel = fixture.editor.sidebar.designPanel.textStyle;
      await fixture.events.click(panel.addStyle);
      expect(panel.applyStyle).toBeDefined();
    });

    // Disable reason: failing since commit 4a93ee5fc82dcdb39d402ebea64c9c34c3045a13
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should allow adding new text style from multi-selection', async () => {
      await fixture.editor.library.textTab.click();
      // Add a paragraph.
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );

      // Select background for being able to insert a text.
      await fixture.events.mouse.clickOn(
        fixture.editor.canvas.framesLayer.frames[0].node,
        '90%',
        '90%'
      );
      // Add a heading.
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[2].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[2].node).toBeTruthy();
      });
      // Select the paragraph as well.
      await selectTarget(fixture.editor.canvas.framesLayer.frames[1].node);

      await fixture.events.click(fixture.editor.sidebar.designTab);
      panel = fixture.editor.sidebar.designPanel.textStyle;

      // Verify that two presets have been added.
      await fixture.events.click(panel.addStyle);
      expect(panel.presets.length).toBe(2);
      await fixture.snapshot('2 style presets added');
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Manage Text Style Presets', () => {
    it('should allow deleting a text style preset', async () => {
      // Add text element and style preset.
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });
      await fixture.events.click(fixture.editor.sidebar.designTab);
      panel = fixture.editor.sidebar.designPanel.textStyle;
      await fixture.events.click(panel.addStyle);

      // Open the style manager.
      await fixture.events.click(panel.moreStyles);
      await fixture.events.click(panel.styleManager.edit);

      await fixture.snapshot('Style presets in edit mode');

      // Verify being in edit mode.
      expect(panel.styleManager.exit).toBeTruthy();

      expect(panel.styleManager.delete).toBeTruthy();
      await fixture.events.click(panel.styleManager.delete);

      // Confirm in the dialog since it's a global preset.

      // We have two dialogues open now.
      const dialogs = await fixture.screen.findAllByRole('dialog');
      expect(dialogs.length).toBe(2);
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: 'Delete' })
      );

      // Verify the picker was closed (due to removing all elements).
      expect(() => panel.styleManager.exit).toThrow();
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Apply Text Style Presets', () => {
    it('should apply text style to a single text element', async () => {
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });

      // Add a preset
      await fixture.events.click(fixture.editor.sidebar.designTab);
      panel = fixture.editor.sidebar.designPanel.textStyle;
      await fixture.events.click(panel.addStyle);

      // Select background for being able to insert a text.
      await fixture.events.mouse.clickOn(
        fixture.editor.canvas.framesLayer.frames[0].node,
        '90%',
        '90%'
      );

      // Add a heading.
      await fixture.events.click(fixture.editor.sidebar.insertTab);
      await fixture.editor.library.textTab.click();
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));

      await fixture.events.click(fixture.editor.sidebar.designTab);
      panel = fixture.editor.sidebar.designPanel.textStyle;
      await fixture.events.click(panel.applyStyle);
      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].fontSize).toEqual(
        DEFAULT_PRESET.fontSize
      );
      await fixture.snapshot('2 texts same attributes');
    });

    // Disable reason: failing since commit 4a93ee5fc82dcdb39d402ebea64c9c34c3045a13
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('should apply text style to multiple text elements', async () => {
      await fixture.editor.library.textTab.click();
      // Add a paragraph.
      const paragraphButton = await waitFor(() => {
        if (!fixture.editor.library.text.preset('Paragraph')) {
          throw new Error('paragraph button not ready');
        }
        return fixture.editor.library.text.preset('Paragraph');
      });
      await fixture.events.click(paragraphButton);

      // Select background for being able to insert a text.
      await fixture.events.mouse.clickOn(
        fixture.editor.canvas.framesLayer.frames[0].node,
        '90%',
        '90%'
      );
      // Add a heading.
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
      await fixture.events.click(fixture.editor.sidebar.designTab);
      panel = fixture.editor.sidebar.designPanel.textStyle;
      await fixture.events.click(panel.addStyle);

      await waitFor(() => {
        if (!fixture.editor.canvas.framesLayer.frames[1].node) {
          throw new Error('node not ready');
        }
        expect(fixture.editor.canvas.framesLayer.frames[1].node).toBeTruthy();
      });
      // Select both.
      await selectTarget(fixture.editor.canvas.framesLayer.frames[1].node);

      await fixture.events.click(panel.applyStyle);
      const storyContext = await fixture.renderHook(() => useStory());
      // Verify that both now have bold.
      expect(storyContext.state.selectedElements[0].content).toContain(
        '<span style="font-weight: 700">'
      );
      expect(storyContext.state.selectedElements[1].content).toContain(
        '<span style="font-weight: 700">'
      );
      await fixture.snapshot('2 selected texts, same style');
    });
  });
});
