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
      moveRel(target, 50, 20),
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
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);

      // Verify that no styles are added currently.
      const noStylesText = fixture.screen.getByText('No Styles Saved');
      expect(noStylesText).toBeDefined();
      // Click to add a style and verify it was added.
      panel = fixture.editor.inspector.designPanel.textStyle;
      await fixture.events.click(panel.addStyle);
      expect(panel.applyStyle).toBeDefined();
    });

    it('should allow adding new text style from multi-selection', async () => {
      await fixture.editor.library.textTab.click();
      // Add a paragraph.
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      // Add a heading.
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[2].node);
      // Select the paragraph as well.
      await fixture.events.sleep(4000);
      await selectTarget(fixture.editor.canvas.framesLayer.frames[1].node);
      await fixture.events.sleep(4000);

      panel = fixture.editor.inspector.designPanel.textStyle;

      // Verify that two presets have been added.
      await fixture.events.click(panel.addStyle);
      expect(panel.presets.length).toBe(2);
      await fixture.snapshot('2 style presets added');
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Manage Text Style Presets', () => {
    it('should allow deleting a text style preset', async () => {
      // Add text element and style preset.
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
      panel = fixture.editor.inspector.designPanel.textStyle;
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
      await waitFor(() => {
        // We have two dialogues open now.
        const dialogs = fixture.screen.getAllByRole('dialog');
        expect(dialogs.length).toBe(2);
      });
      await fixture.events.click(
        fixture.screen.getByRole('button', { name: 'Delete' })
      );

      // Verify the picker was closed (due to removing all elements).
      expect(() => panel.styleManager.exit).toThrow();
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Apply Text Style Presets', () => {
    it('should apply text style to a single text element', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);

      // Add a preset
      panel = fixture.editor.inspector.designPanel.textStyle;
      await fixture.events.click(panel.addStyle);

      // Add a heading.
      await fixture.editor.library.textTab.click();
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));

      await fixture.events.click(panel.applyStyle);
      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].fontSize).toEqual(
        DEFAULT_PRESET.fontSize
      );
      await fixture.snapshot('2 texts same attributes');
    });

    it('should apply text style to multiple text elements', async () => {
      await fixture.editor.library.textTab.click();
      // Add a paragraph.
      const paragraphButton = await waitFor(() =>
        fixture.editor.library.text.preset('Paragraph')
      );
      await fixture.events.click(paragraphButton);
      // Add a heading.
      await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
      panel = fixture.editor.inspector.designPanel.textStyle;
      await fixture.events.click(panel.addStyle);

      await waitFor(() => fixture.editor.canvas.framesLayer.frames[1].node);
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
