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
import { addBackgroundImage } from '../components/dropTargets/karma/background.karma';
import { useStory } from '../app/story';
import { Fixture } from './fixture';

/**
 * Takes an HTMLCollection and sequentially performs an
 * async action on each element in the collection.
 *
 * Call order of operations is based on the order of
 * the elements in the collection
 *
 * @param {HTMLCollection} htmlCollection - collection of html elements to perform operation on.
 * @param {(el: HTMLElement, i: number) => Promise<void>} op - async operation
 * @return {Promise<void>}
 */
function sequencedForEach(htmlCollection, op) {
  return new Promise((res) => {
    Array.from(htmlCollection)
      .map((htmlElement, i) => async () => {
        await op(htmlElement, i);
      })
      // [p1, p2, p3, p4] -> promise.resolve().then(p1).then(p2).then(p3).then(p4)
      .reduce((p, fn) => p.then(fn), Promise.resolve())
      .then(res);
  });
}

[
  {
    title: 'Foreground Copy & Paste',
    action: async (fixture) => {
      await fixture.events.clipboard.copy();
      await fixture.events.clipboard.paste();
    },
  },
  {
    title: 'Duplicate',
    action: async (fixture) => {
      await fixture.events.keyboard.shortcut('mod+d');
    },
  },
].forEach(({ title, action }) => {
  describe(title, () => {
    let fixture;
    let element;

    beforeEach(async () => {
      fixture = new Fixture();
      await fixture.render();

      // Insert selected element to perform operations on.
      const insertElement = await fixture.renderHook(() => useInsertElement());
      element = await fixture.act(() =>
        insertElement('text', {
          x: 10,
          y: 10,
          width: 100,
          height: 50,
          content: 'Hello, Stories!',
        })
      );
    });

    afterEach(() => {
      fixture.restore();
    });

    it('pastes copied element in a new location and selects it', async () => {
      await action(fixture);
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

    // Disable reason: flakey tests.
    // See https://github.com/google/web-stories-wp/pull/6162
    // eslint-disable-next-line jasmine/no-disabled-tests
    xit('retains all foreground animations', async () => {
      // open effect chooser
      const effectChooserToggle =
        fixture.editor.inspector.designPanel.animation.effectChooser;
      await fixture.events.click(effectChooserToggle, { clickCount: 1 });

      // see that effect chooser is open
      const effectChooser = fixture.screen.getByRole('list', {
        name: /Available Animations To Select/,
      });

      // iterate through children with process
      await sequencedForEach(
        effectChooser.children,
        async (effectButton, i) => {
          // first button is `none` and doesn't apply animation
          if (
            i === 0 ||
            effectButton.getAttribute('aria-disabled') === 'true'
          ) {
            return;
          }
          // apply animation to element
          await fixture.events.click(effectButton, { clickCount: 1 });

          // copy and paste animated element with Animations
          const copied = await fixture.renderHook(() =>
            useStory(({ state }) => ({
              elements: state.selectedElements,
              elementAnimations: state.selectedElementAnimations,
            }))
          );
          expect(copied.elementAnimations.length).toEqual(1);
          await action(fixture);
          const pasted = await fixture.renderHook(() =>
            useStory(({ state }) => ({
              elements: state.selectedElements,
              elementAnimations: state.selectedElementAnimations,
            }))
          );
          expect(pasted.elementAnimations.length).toEqual(1);

          // Coppied and Pasted anims should share all attributes
          // Except `id` & `targets`
          const {
            id: cId,
            targets: cTargets,
            ...cPersisted
          } = copied.elementAnimations[0];
          const {
            id: pId,
            targets: pTargets,
            ...pPersisted
          } = pasted.elementAnimations[0];
          expect(cPersisted).toEqual(pPersisted);

          // pasted animations should contain the newly pasted
          // element's id as it's only target
          const pastedElId = pasted.elements[0].id;
          expect(pTargets).toEqual([pastedElId]);

          // see that current page has new animation
          const { animations, elements } = await fixture.renderHook(() =>
            useStory(({ state }) => state.currentPage)
          );

          // 2 comes from background + initial copied element
          expect(elements.length).toEqual(i + 2);
          // 1 comes from original copied element animation
          expect(animations.length).toEqual(i + 1);
        }
      );
    });
  });
});

describe('Background Copy & Paste', () => {
  let fixture;

  const goToNextPage = async () => {
    const nextPageButton = fixture.screen.getByRole('button', {
      name: /Next Page/,
    });
    await fixture.events.click(nextPageButton, { clickCount: 1 });
  };

  const goToPreviousPage = async () => {
    const previousPageButton = fixture.screen.getByRole('button', {
      name: /Previous Page/,
    });
    await fixture.events.click(previousPageButton, { clickCount: 1 });
  };

  const openEffectChooser = async () => {
    const effectChooserToggle =
      fixture.editor.inspector.designPanel.animation.effectChooser;
    await fixture.events.click(effectChooserToggle, { clickCount: 1 });
  };

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    // Create a new blank page to copy to.
    const addNewPageButton = fixture.screen.getByRole('button', {
      name: /Add New Page/,
    });
    await fixture.events.click(addNewPageButton, { clickCount: 1 });

    // Navigate back to previous page and aff Background image
    await goToPreviousPage();
    // we want to zoom in a little bit so background
    // is big enough for all background animations.
    // scale is between 100 -> 400
    await addBackgroundImage(fixture, { properties: { scale: 200 } });
  });

  afterEach(() => {
    fixture.restore();
  });

  it('works for all background animations', async () => {
    // open effect chooser
    await openEffectChooser();

    // see that effect chooser is open
    const effectChooser = fixture.screen.getByRole('list', {
      name: /Available Animations To Select/,
    });

    // iterate through children with process
    await sequencedForEach(effectChooser.children, async (_, i) => {
      // need to regrab the button because we're openeing
      // and closing effect chooser causing karma ids to change
      const effectButton = fixture.screen.getByRole('list', {
        name: /Available Animations To Select/,
      }).children[i];

      // first button is `none` and doesn't apply animation
      if (i === 0 || effectButton.getAttribute('aria-disabled') === 'true') {
        return;
      }
      // apply animation to element
      await fixture.events.click(effectButton, { clickCount: 1 });

      // copy background element with animation
      const copied = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          elements: state.selectedElements,
          elementAnimations: state.selectedElementAnimations,
        }))
      );
      expect(copied.elementAnimations.length).toEqual(1);
      await fixture.events.clipboard.copy();

      // Go to second page
      await goToNextPage();

      // Paste background with animation to second page
      await fixture.events.clipboard.paste();
      const pasted = await fixture.renderHook(() =>
        useStory(({ state }) => ({
          elements: state.selectedElements,
          elementAnimations: state.selectedElementAnimations,
        }))
      );
      expect(pasted.elementAnimations.length).toEqual(1);

      // Coppied and Pasted anims should share all attributes
      // Except `id` & `targets`
      const {
        id: cId,
        targets: cTargets,
        ...cPersisted
      } = copied.elementAnimations[0];
      const {
        id: pId,
        targets: pTargets,
        ...pPersisted
      } = pasted.elementAnimations[0];
      expect(cPersisted).toEqual(pPersisted);

      // pasted animations should contain the newly pasted
      // element's id as it's only target
      const pastedElId = pasted.elements[0].id;
      expect(pTargets).toEqual([pastedElId]);

      // see that current page has new animation
      const { animations, elements } = await fixture.renderHook(() =>
        useStory(({ state }) => state.currentPage)
      );

      // Pages should only contain background
      expect(elements.length).toEqual(1);
      // Pages should only contain background animation
      expect(animations.length).toEqual(1);

      // Go back to previous page to restart process
      await goToPreviousPage();
      // Select Background
      const setSelectedById = await fixture.renderHook(() =>
        useStory(({ actions }) => actions.setSelectedElementsById)
      );
      setSelectedById({ elementIds: [copied.elements[0].id] });
      // reopen effect chooser
      await openEffectChooser();
    });
  });
});
