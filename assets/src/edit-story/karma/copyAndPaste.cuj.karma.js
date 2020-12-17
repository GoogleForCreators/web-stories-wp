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
import useInsertElement from '../components/canvas/useInsertElement';
import { useStory } from '../app/story';
import { Fixture } from './fixture';

describe('Copy & Paste', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('pastes copied element in a new location and selects it', async () => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    const element = await fixture.act(() =>
      insertElement('text', {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
        content: 'Hello, Stories!',
      })
    );
    await fixture.events.clipboard.copy();
    await fixture.events.clipboard.paste();
    const currentPage = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage)
    );

    // get pasted element
    // elements = [background, originalElement, pastedElement]
    const newElements = currentPage.elements
      .filter((el) => !el.isBackground)
      .filter((el) => el.id !== element.id);
    // only one element should have been added
    expect(newElements.length).toEqual(1);

    // see that the new element retains important properties
    // and doesn't have the same position as original element
    const newElement = newElements[0];
    ['type', 'content', 'width', 'height'].forEach((key) =>
      expect(newElement[key]).toEqual(element[key])
    );
    ['x', 'y'].forEach((key) =>
      expect(newElement[key]).not.toEqual(element[key])
    );

    // see that new element gains selection
    const selection = await fixture.renderHook(() =>
      useStory(({ state }) => state.selectedElementIds)
    );
    expect(selection).toEqual([newElement.id]);
  });

  it('foreground animations', async () => {
    const insertElement = await fixture.renderHook(() => useInsertElement());
    // const element = await fixture.act(() =>
    await fixture.act(() =>
      insertElement('text', {
        x: 10,
        y: 10,
        width: 100,
        height: 50,
        content: 'Hello, Stories!',
      })
    );

    // open effect chooser
    const effectChooserToggle =
      fixture.editor.inspector.designPanel.animation.effectChooser;
    await fixture.events.click(effectChooserToggle, { clickCount: 1 });

    // see that effect chooser is open
    const effectChooser = fixture.screen.getByRole('list', {
      name: /Available Animations To Select/,
    });

    // iterate through children with process
    // let coppied = element;
    return Array.from(effectChooser.children)
      .map((effectButton, i) => async () => {
        // first button is `none` and doesn't apply animation
        if (i === 0) {
          return;
        }
        // apply animation to element
        await fixture.events.click(effectButton, { clickCount: 1 });

        // copy and paste animated element
        await fixture.events.clipboard.copy();
        await fixture.events.clipboard.paste();

        // see that current page has new animation
        const { animations, elements } = await fixture.renderHook(() =>
          useStory(({ state }) => state.currentPage)
        );

        // 2 comes from background + initial coppied element
        expect(elements.length).toEqual(i + 2);
        expect(animations.length).toEqual(i + 1);
      })
      .reduce((p, fn) => p.then(fn), Promise.resolve());
  });
});

// describe('Duplicate Element', () => {});

// describe('Duplicate Page', () => {});
