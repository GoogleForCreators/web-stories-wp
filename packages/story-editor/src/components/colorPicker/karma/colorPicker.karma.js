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
import { Fixture } from '../../../karma';
import { useStory } from '../../../app';

describe('ColorPicker', () => {
  ['LTR', 'RTL'].forEach((direction) => {
    describe(`when document is in ${direction} mode`, () => {
      let fixture;

      beforeEach(async () => {
        fixture = new Fixture();
        fixture.setConfig({ isRTL: direction === 'RTL' });
        await fixture.render();
        await fixture.collapseHelpCenter();
      });

      afterEach(() => {
        fixture.restore();
      });

      it('should display correctly', async () => {
        // Click the background element
        await fixture.events.mouse.clickOn(
          fixture.editor.canvas.framesLayer.frames[0].node,
          10,
          10
        );

        await fixture.events.click(fixture.editor.sidebar.designTab);
        const bgPanel = fixture.editor.sidebar.designPanel.pageBackground;

        // Click the background page panel color preview
        await fixture.events.click(bgPanel.backgroundColor.button);

        await waitFor(() => {
          if (!bgPanel.backgroundColor.picker) {
            throw new Error('picker not ready');
          }
          expect(bgPanel.backgroundColor.picker).toBeDefined();
        });

        // Verify there are no aXe violations within the color picker.
        await expectAsync(
          bgPanel.backgroundColor.picker.node
        ).toHaveNoViolations();

        // Snapshot it
        await fixture.snapshot('Basic color picker');

        // Go to the custom color picker as well and snapshot that too
        await fixture.events.click(bgPanel.backgroundColor.picker.custom);
        await fixture.snapshot('Custom color picker');
      });
    });
  });

  describe('Color Picker: Saved colors', () => {
    let fixture;

    beforeEach(async () => {
      fixture = new Fixture();
      await fixture.render();
      await fixture.collapseHelpCenter();
      localStorage.setItem(
        'web_stories_ui_panel_settings:shapeStyle',
        JSON.stringify({ isCollapsed: false })
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
      it('should allow adding local colors', async () => {
        // Switch to shapes tab and click the triangle
        await fixture.events.click(fixture.editor.library.shapesTab);
        await fixture.events.click(
          fixture.editor.library.shapes.shape('Triangle')
        );

        await fixture.events.click(fixture.editor.sidebar.designTab);
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.button
        );

        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.picker.addSavedColor(
            'global'
          )
        );
        expect(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.picker.applySavedColor(
            '#c4c4c4'
          )
        ).toBeTruthy();
      });

      it('should allow adding global colors', async () => {
        // Switch to shapes tab and click the triangle
        await fixture.events.click(fixture.editor.library.shapesTab);
        await fixture.events.click(
          fixture.editor.library.shapes.shape('Triangle')
        );

        await fixture.events.click(fixture.editor.sidebar.designTab);
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.button
        );

        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.picker.addSavedColor(
            'local'
          )
        );
        expect(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.picker.applySavedColor(
            '#c4c4c4'
          )
        ).toBeTruthy();
      });

      it('should allow applying global colors', async () => {
        // Add shape and save its color.
        await fixture.events.click(fixture.editor.library.shapesTab);
        await fixture.events.click(
          fixture.editor.library.shapes.shape('Triangle')
        );

        await fixture.events.click(fixture.editor.sidebar.designTab);
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.button
        );
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.picker.addSavedColor(
            'global'
          )
        );

        // Add text and apply the previously saved color.
        await fixture.events.click(fixture.editor.sidebar.insertTab);
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
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.textStyle.fontColor.button
        );
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.textStyle.fontColor.picker.applySavedColor(
            '#c4c4c4'
          )
        );
        const [text] = await getSelection();
        expect(text.content).toEqual(
          '<span style="color: #c4c4c4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>'
        );
      });

      it('should allow applying local colors', async () => {
        await fixture.events.click(fixture.editor.library.shapesTab);
        await fixture.events.click(
          fixture.editor.library.shapes.shape('Triangle')
        );

        await fixture.events.click(fixture.editor.sidebar.designTab);
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.button
        );
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.shapeStyle.backgroundColor.picker.addSavedColor(
            'local'
          )
        );

        // Add text and apply the previously saved color.
        await fixture.events.click(fixture.editor.sidebar.insertTab);
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
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.textStyle.fontColor.button
        );
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.textStyle.fontColor.picker.applySavedColor(
            '#c4c4c4'
          )
        );
        const [text] = await getSelection();
        expect(text.content).toEqual(
          '<span style="color: #c4c4c4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>'
        );
      });

      it('should allow saving text background color', async () => {
        // Add text element
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
        // add fill
        await fixture.events.click(fixture.editor.sidebar.designTab);
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.textStyle.fill
        );

        // save default text fill to local palette
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.textStyle.backgroundColor.button
        );
        const picker =
          fixture.editor.sidebar.designPanel.textStyle.backgroundColor.picker;
        await fixture.events.click(picker.addSavedColor('local'));

        // check if default text fill is saved
        expect(picker.applySavedColor('#c4c4c4')).toBeTruthy();
      });
    });

    describe('CUJ: Creator can Apply or Save a Color from/to Their Preset Library: Manage Color Presets', () => {
      it('should allow deleting local and global color presets', async () => {
        // Add text element and a color preset.
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
        await fixture.events.click(
          fixture.editor.sidebar.designPanel.textStyle.fontColor.button
        );
        const picker =
          fixture.editor.sidebar.designPanel.textStyle.fontColor.picker;
        await fixture.events.click(picker.addSavedColor('global'));
        await fixture.events.click(picker.addSavedColor('local'));

        await fixture.events.click(picker.editButton);

        await fixture.snapshot('Color presets in edit mode');

        // Verify being in edit mode.

        expect(picker.exitEditButton).toBeTruthy();
        expect(picker.deleteGlobalColor).toBeTruthy();
        // Verify edit mode has no aXe violations.
        await expectAsync(picker.exitEditButton).toHaveNoViolations();
        await expectAsync(picker.deleteGlobalColor).toHaveNoViolations();

        // Delete global preset.
        await fixture.events.click(picker.deleteGlobalColor);

        // Confirm both the color picker and the confirmation dialog are open since it's a global color.
        await waitFor(() => {
          if (fixture.screen.getAllByRole('dialog').length !== 2) {
            throw new Error('dialog not ready');
          }
          expect(fixture.screen.getAllByRole('dialog').length).toBe(2);
        });
        await fixture.events.click(
          fixture.screen.getByRole('button', { name: 'Delete' })
        );

        // Delete local preset.
        await fixture.events.click(picker.deleteStoryColor);

        // Verify the edit mode was exited (due to removing all elements).
        expect(() => picker.exitEditButton).toThrow();

        // Verify there is no edit button either (since we have no presets left).
        expect(() => picker.editButton).toThrow();
      });
    });
  });
});
