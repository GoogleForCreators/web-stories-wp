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
import { useStory } from '../../../../../app/story';

describe('Layer Panel', () => {
  let fixture;
  let layerPanel;
  let insertElement;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ layerLocking: true, layerNaming: true });
    await fixture.render();
    await fixture.collapseHelpCenter();
    layerPanel = fixture.editor.footer.layerPanel;
    await fixture.events.click(layerPanel.togglePanel);
    await fixture.events.click(fixture.editor.sidebar.designTab);

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
    await fixture.events.click(fixture.editor.sidebar.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    // Select background for being able to insert another text.
    const bgLayer = layerPanel.getLayerByInnerText('Background');
    await fixture.events.click(bgLayer);
    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

    await fixture.events.click(fixture.editor.sidebar.designTab);
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

  it('should be able to rename a layer by clicking Enter', async () => {
    await fixture.events.click(fixture.editor.sidebar.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));

    const titleLayer = layerPanel.getLayerByInnerText('Title 1');

    await fixture.events.click(titleLayer, { clickCount: 2 });
    await fixture.events.keyboard.type('New Title Name');
    await fixture.events.keyboard.press('Enter');

    expect(
      layerPanel.layers.filter((layer) => layer.innerText === 'New Title Name')
        ?.length
    ).toBe(1);
    expect(
      layerPanel.layers.filter((layer) => layer.innerText === 'Title 1')?.length
    ).toBe(0);
  });

  it('should be able to rename a layer on blur (e.g. clicking on another layer)', async () => {
    await fixture.events.click(fixture.editor.sidebar.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));

    const titleLayer = layerPanel.getLayerByInnerText('Title 1');

    await fixture.events.click(titleLayer, { clickCount: 2 });
    await fixture.events.keyboard.type('New Title Name');

    const bgLayer = layerPanel.getLayerByInnerText('Background');

    await fixture.events.click(bgLayer);

    expect(
      layerPanel.layers.filter((layer) => layer.innerText === 'New Title Name')
        ?.length
    ).toBe(1);
    expect(
      layerPanel.layers.filter((layer) => layer.innerText === 'Title 1')?.length
    ).toBe(0);
  });

  it('should be able to exit renaming a layer by clicking Esc', async () => {
    await fixture.events.click(fixture.editor.sidebar.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));

    const titleLayer = layerPanel.getLayerByInnerText('Title 1');

    await fixture.events.click(titleLayer, { clickCount: 2 });
    await fixture.events.keyboard.type('New Title Name');
    await fixture.events.keyboard.press('Esc');

    expect(
      layerPanel.layers.filter((layer) => layer.innerText === 'New Title Name')
        ?.length
    ).toBe(0);
    expect(
      layerPanel.layers.filter((layer) => layer.innerText === 'Title 1')?.length
    ).toBe(1);
  });

  it('should be able to duplicate elements with duplicate action', async () => {
    await fixture.events.click(fixture.editor.sidebar.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    // Select background for being able to insert another text.
    const bgLayer = layerPanel.getLayerByInnerText('Background');
    await fixture.events.click(bgLayer);
    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

    await fixture.events.click(fixture.editor.sidebar.designTab);
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

  it('should be able to lock and unlock elements with lock action', async () => {
    await fixture.events.click(fixture.editor.sidebar.insertTab);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Title 1'));
    // Select background for being able to insert another text.
    const bgLayer = layerPanel.getLayerByInnerText('Background');
    await fixture.events.click(bgLayer);
    await fixture.events.click(fixture.editor.library.text.preset('Title 2'));

    await fixture.events.click(fixture.editor.sidebar.designTab);
    expect(layerPanel.layers.length).toBe(3);
    const elementALayer = layerPanel.getLayerByInnerText('Title 1');
    const elementBLayer = layerPanel.getLayerByInnerText('Title 2');

    // Hover layer, enable lock, and hover somewhere else
    await fixture.events.hover(elementALayer);
    const lockButton = within(elementALayer).getByLabelText('Lock/Unlock');
    await fixture.events.click(lockButton);
    await fixture.events.hover(elementBLayer);

    // Check that lock is now permanently displayed and the element actually has a lock
    const lockIcon = within(elementALayer).queryByLabelText('Locked');
    expect(lockIcon).toBeDefined();
    const elementsAfterLocking = await getElements();
    const title1AfterLocking = elementsAfterLocking.find(({ content }) =>
      content?.includes('Title 1')
    );
    expect(title1AfterLocking.isLocked).toBe(true);

    // Hover layer, disable lock, and hover somewhere else
    await fixture.events.hover(elementALayer);
    const unlockButton = within(elementALayer).getByLabelText('Lock/Unlock');
    await fixture.events.click(unlockButton);
    await fixture.events.hover(elementBLayer);

    // Check that lock is now permanently displayed and the element actually has a lock
    const noLockIcon = within(elementALayer).queryByLabelText('Locked');
    expect(noLockIcon).toBe(null);
    const elementsAfterUnlocking = await getElements();
    const title1AfterUnlocking = elementsAfterUnlocking.find(({ content }) =>
      content?.includes('Title 1')
    );
    expect(title1AfterUnlocking.isLocked).not.toBe(true);
  });

  async function getElements() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.currentPage.elements;
  }
});
