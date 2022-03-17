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
import { TEXT_ELEMENT_DEFAULT_FONT } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma';
import { useInsertElement } from '../../../../canvas';

describe('Layer Panel', () => {
  let fixture;
  let layerPanel;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
    layerPanel = fixture.editor.footer.layerPanel;
    await fixture.events.click(layerPanel.togglePanel);
    await fixture.events.click(fixture.editor.inspector.designTab);

    insertElement = await fixture.renderHook(() => useInsertElement());
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should show the number of layers', async () => {
    expect(layerPanel.layers.length).toBe(1);
    expect(layerPanel.togglePanel.textContent).toBe('Layers1');

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
    expect(layerPanel.togglePanel.textContent).toBe('Layers2');

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
    expect(layerPanel.togglePanel.textContent).toBe('Layers3');
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

  it('should be able to delete elements with delete action', async () => {
    await fixture.events.click(fixture.editor.inspector.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    // Select background for being able to insert another text.
    const bgLayer = layerPanel.getLayerByInnerText('Background');
    await fixture.events.click(bgLayer);
    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

    await fixture.events.click(fixture.editor.inspector.designTab);
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
    await fixture.events.click(fixture.editor.inspector.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    // Select background for being able to insert another text.
    const bgLayer = layerPanel.getLayerByInnerText('Background');
    await fixture.events.click(bgLayer);
    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

    await fixture.events.click(fixture.editor.inspector.designTab);
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
