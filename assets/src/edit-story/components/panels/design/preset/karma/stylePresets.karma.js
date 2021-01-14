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
import { Fixture } from '../../../../../karma/fixture';
import { useInsertElement } from '../../../../canvas';
import createSolid from '../../../../../utils/createSolid';
import { BACKGROUND_TEXT_MODE } from '../../../../../constants';
import { useStory } from '../../../../../app/story';
import { DEFAULT_PRESET } from '../../../../library/panes/text/textPresets';

describe('Panel: Style Presets', () => {
  let fixture;

  const selectTarget = async (target) => {
    const { x, y, width, height } = target.getBoundingClientRect();
    await fixture.events.keyboard.down('Shift');
    await fixture.events.mouse.click(x + width / 2, y + height / 2);
    await fixture.events.keyboard.up('Shift');
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    localStorage.setItem(
      'web_stories_ui_panel_settings:stylepreset-style',
      JSON.stringify({ isCollapsed: false, height: 200 })
    );
  });

  afterEach(() => {
    fixture.restore();
    localStorage.clear();
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Display Panel', () => {
    it('should display text styles panel for a text element', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const addButton =
        fixture.editor.inspector.designPanel.textStylePreset.add;
      expect(addButton).toBeTruthy();
    });

    it('should not display text styles panel in case of mixed multi-selection', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      // Add a shape element.
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const element = await fixture.act(() =>
        insertElement('shape', {
          x: 10,
          y: 10,
          width: 50,
          height: 50,
          backgroundColor: createSolid(1, 15, 15, 0.2),
          backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
        })
      );
      const target = fixture.editor.canvas.framesLayer.frame(element.id).node;
      await selectTarget(target);
      // Verify that the panel is not found.
      expect(
        () => fixture.editor.inspector.designPanel.textStylePreset.add
      ).toThrow();
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Save Text Style', () => {
    it('should allow adding new text style from a text element', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.add
      );
      const applyButton =
        fixture.editor.inspector.designPanel.textStylePreset.apply;
      // Verify that the preset has been added
      expect(applyButton).toBeDefined();
    });

    it('should allow adding new text style from multi-selection', async () => {
      await fixture.editor.library.textTab.click();
      // Add a paragraph.
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      // Add a heading.
      await fixture.events.click(
        fixture.editor.library.text.preset('Heading 1')
      );
      // Select the paragraph as well.
      await selectTarget(fixture.editor.canvas.framesLayer.frames[1].node);

      // Verify that two presets have been added.
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.add
      );
      const presets =
        fixture.editor.inspector.designPanel.textStylePreset.presets;
      expect(presets.length).toBe(2);
      await fixture.snapshot('2 style presets added');
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Manage Text Style Presets', () => {
    it('should allow deleting a text style preset', async () => {
      // Add text element and style preset.
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.add
      );
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.edit
      );

      await fixture.snapshot('Style presets in edit mode');

      // Verify being in edit mode.
      const exitEditButton =
        fixture.editor.inspector.designPanel.textStylePreset.exit;
      expect(exitEditButton).toBeTruthy();

      const deletePresetButton =
        fixture.editor.inspector.designPanel.textStylePreset.delete;
      expect(deletePresetButton).toBeTruthy();
      await fixture.events.click(deletePresetButton);

      // Verify the edit mode was exited (due to removing all elements).
      expect(
        () => fixture.editor.inspector.designPanel.textStylePreset.exit
      ).toThrow();

      // Verify there is no edit button either (since we have no presets left).
      expect(
        () => fixture.editor.inspector.designPanel.textStylePreset.edit
      ).toThrow();
    });

    it('should allow deleting a text style preset when color presets are present', async () => {
      // Add text element and style preset.
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.add
      );

      // Add color preset.
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.add
      );

      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.edit
      );

      // Verify being in edit mode.
      expect(
        fixture.editor.inspector.designPanel.textStylePreset.exit
      ).toBeTruthy();
      const deletePresetButton =
        fixture.editor.inspector.designPanel.textStylePreset.delete;

      expect(deletePresetButton).toBeTruthy();
      await fixture.events.click(deletePresetButton);

      // Verify the edit mode was exited (due to removing all elements).
      expect(
        () => fixture.editor.inspector.designPanel.textStylePreset.exit
      ).toThrow();

      // Verify there is no edit button either (since we have no presets left).
      expect(
        () => fixture.editor.inspector.designPanel.textStylePreset.edit
      ).toThrow();
    });
  });

  describe('CUJ: Creator can Apply or Save Text Style from/to Their Preset Library: Apply Text Style Presets', () => {
    it('should apply text style to a single text element', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);

      // Add a preset
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.add
      );

      // Add a heading.
      await fixture.editor.library.textTab.click();
      await fixture.events.click(
        fixture.editor.library.text.preset('Heading 1')
      );

      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.apply
      );
      const storyContext = await fixture.renderHook(() => useStory());
      expect(storyContext.state.selectedElements[0].fontSize).toEqual(
        DEFAULT_PRESET.fontSize
      );
      await fixture.snapshot('2 texts same attributes');
    });

    it('should apply text style to multiple text elements', async () => {
      await fixture.editor.library.textTab.click();
      // Add a paragraph.
      await fixture.events.click(
        fixture.editor.library.text.preset('Paragraph')
      );
      // Add a heading.
      await fixture.events.click(
        fixture.editor.library.text.preset('Heading 1')
      );
      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.add
      );

      // Select both.
      await selectTarget(fixture.editor.canvas.framesLayer.frames[1].node);

      await fixture.events.click(
        fixture.editor.inspector.designPanel.textStylePreset.apply
      );
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
