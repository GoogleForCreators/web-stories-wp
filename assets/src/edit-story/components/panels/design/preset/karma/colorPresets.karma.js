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
import { useStory } from '../../../../../app/story';

describe('Panel: Color Presets', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    localStorage.setItem(
      'web_stories_ui_panel_settings:stylepreset-color',
      JSON.stringify({ isCollapsed: false, height: 200 })
    );
  });

  afterEach(() => {
    fixture.restore();
    localStorage.clear();
  });

  const getSelection = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements;
  };

  describe('CUJ: Creator can Apply or Save a Color from/to Their Preset Library: Add Colors', () => {
    it('should display color presets panel for a text element', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      const addButton =
        fixture.editor.inspector.designPanel.colorPreset.global.add;
      expect(addButton).toBeTruthy();
      expect(
        fixture.editor.inspector.designPanel.colorPreset.local.add
      ).toBeTruthy();
    });

    it('should allow adding both local and global colors', async () => {
      // Switch to shapes tab and click the triangle
      await fixture.events.click(fixture.editor.library.shapesTab);
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );

      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.global.add
      );
      expect(
        fixture.editor.inspector.designPanel.colorPreset.global.apply
      ).toBeTruthy();

      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.local.add
      );
      expect(
        fixture.editor.inspector.designPanel.colorPreset.local.apply
      ).toBeTruthy();
    });

    it('should allow applying global colors', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.global.add
      );
      await fixture.events.click(fixture.editor.library.shapesTab);
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.global.apply
      );
      const [shape] = await getSelection();
      expect(shape.backgroundColor).toEqual({ color: { r: 0, g: 0, b: 0 } });
    });

    it('should allow applying local colors', async () => {
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.local.add
      );
      await fixture.events.click(fixture.editor.library.shapesTab);
      await fixture.events.click(
        fixture.editor.library.shapes.shape('Triangle')
      );
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.local.apply
      );
      const [shape] = await getSelection();
      expect(shape.backgroundColor).toEqual({ color: { r: 0, g: 0, b: 0 } });
    });
  });

  describe('CUJ: Creator can Apply or Save a Color from/to Their Preset Library: Manage Color Presets', () => {
    it('should allow deleting local and global color presets', async () => {
      // Add text element and a color preset.
      await fixture.events.click(fixture.editor.library.textAdd);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.global.add
      );
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.local.add
      );

      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.edit
      );

      await fixture.snapshot('Color presets in edit mode');

      // Verify being in edit mode.
      const exitEditButton =
        fixture.editor.inspector.designPanel.colorPreset.exit;
      expect(exitEditButton).toBeTruthy();
      const deleteGlobalButton =
        fixture.editor.inspector.designPanel.colorPreset.global.delete;

      expect(deleteGlobalButton).toBeTruthy();

      // Delete both local and global presets.
      await fixture.events.click(deleteGlobalButton);
      await fixture.events.click(
        fixture.editor.inspector.designPanel.colorPreset.local.delete
      );

      // Verify the edit mode was exited (due to removing all elements).
      expect(
        () => fixture.editor.inspector.designPanel.colorPreset.exit
      ).toThrow();

      // Verify there is no edit button either (since we have no presets left).
      expect(
        () => fixture.editor.inspector.designPanel.colorPreset.edit
      ).toThrow();
    });
  });
});
