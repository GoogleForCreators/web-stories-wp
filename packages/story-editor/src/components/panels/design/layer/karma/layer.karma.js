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
import { within } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../../../app/font/defaultFonts';
import { useInsertElement } from '../../../../canvas';

describe('Layer Panel', () => {
  let fixture;
  let layerPanel;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
    layerPanel = fixture.editor.inspector.designPanel.layerPanel;

    insertElement = await fixture.renderHook(() => useInsertElement());
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should show the number of layers', async () => {
    expect(layerPanel.layers.length).toBe(1);
    expect(layerPanel.panelBadge.textContent).toBe(
      layerPanel.layers.length.toString()
    );

    await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt egestas velit quis tincidunt.',
        x: 40,
        y: 40,
        width: 250,
      })
    );

    expect(layerPanel.layers.length).toBe(2);
    expect(layerPanel.panelBadge.textContent).toBe(
      layerPanel.layers.length.toString()
    );

    await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'Doo doo doo',
        x: 40,
        y: 40,
        width: 250,
      })
    );

    expect(layerPanel.layers.length).toBe(3);
    expect(layerPanel.panelBadge.textContent).toBe(
      layerPanel.layers.length.toString()
    );
  });

  it('should show ellipsis for overflowing text', async () => {
    expect(layerPanel.layers.length).toBe(1);
    await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tincidunt egestas velit quis tincidunt.',
        x: 40,
        y: 40,
        width: 250,
      })
    );

    expect(layerPanel.layers.length).toBe(2);

    await fixture.snapshot();
  });

  it('should allow changing the layer panel height via slider', async () => {
    expect(layerPanel.resizeHandle).toBeTruthy();
    const section = layerPanel.resizeHandle.closest('section');
    const initialHeight = section.clientHeight;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(layerPanel.resizeHandle, 3, 3),
      down(),
      moveBy(0, 20, { steps: 6 }),
      up(),
    ]);
    expect(section.clientHeight).toBe(initialHeight - 20);
  });

  it('should not change the layer panel height when changing page', async () => {
    // resize the panel
    let section = layerPanel.resizeHandle.closest('section');
    const initialHeight = section.clientHeight;
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(layerPanel.resizeHandle, 3, 3),
      down(),
      moveBy(0, 30, { steps: 6 }),
      up(),
    ]);
    expect(section.clientHeight).toBe(initialHeight - 30);

    // change page
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);

    // verify panel height did not change
    section = layerPanel.resizeHandle.closest('section');
    expect(section.clientHeight).toBe(initialHeight - 30);
  });

  it('should not open the layer panel if the panel is collapsed when changing page', async () => {
    // close the panel
    expect(layerPanel.panelCollapseButton.getAttribute('aria-expanded')).toBe(
      'true'
    );
    await fixture.events.click(layerPanel.panelCollapseButton);
    expect(layerPanel.panelCollapseButton.getAttribute('aria-expanded')).toBe(
      'false'
    );

    // change page
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);

    // verify panel remains closed
    expect(layerPanel.panelCollapseButton.getAttribute('aria-expanded')).toBe(
      'false'
    );
  });

  it('should be able to delete elements with delete action', async () => {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    // Select background for being able to insert another text.
    const bgLayer = layerPanel.getLayerByInnerText('Background');
    await fixture.events.click(bgLayer);
    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

    expect(layerPanel.layers.length).toBe(3);
    const elementALayer = layerPanel.getLayerByInnerText('Title 1');
    await fixture.events.hover(elementALayer);
    const deleteElementAButton = within(elementALayer).getByLabelText('Delete');
    await fixture.events.click(deleteElementAButton);

    expect(layerPanel.layers.length).toBe(2);
    expect(
      layerPanel.layers.every((layer) => layer.innerText !== 'Title 1')
    ).toBeTrue();
  });

  it('should be able to duplicate elements with duplicate action', async () => {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    // Select background for being able to insert another text.
    const bgLayer = layerPanel.getLayerByInnerText('Background');
    await fixture.events.click(bgLayer);
    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

    expect(layerPanel.layers.length).toBe(3);
    const elementALayer = layerPanel.getLayerByInnerText('Title 1');
    await fixture.events.hover(elementALayer);
    const duplicateElementAButton =
      within(elementALayer).getByLabelText('Duplicate');
    await fixture.events.click(duplicateElementAButton);

    expect(layerPanel.layers.length).toBe(4);
    expect(
      layerPanel.layers.filter((layer) => layer.innerText === 'Title 1')?.length
    ).toBe(2);
  });
});
