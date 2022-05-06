/*
 * Copyright 2021 Google LLC
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

describe('Duplicate Page', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
    // #11321 adding/editing animations on the first page is disabled
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    // Insert selected element to perform operations on.
    const insertElement = await fixture.renderHook(() => useInsertElement());
    await fixture.act(() =>
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

  it('should duplicate an animation', async () => {
    const startPageIndex = await fixture.renderHook(() =>
      useStory(({ state: { currentPageIndex } }) => currentPageIndex)
    );
    // open effect chooser
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );
    const effectChooserToggle =
      fixture.editor.sidebar.designPanel.animation.effectChooser;
    await fixture.events.click(effectChooserToggle, { clickCount: 1 });

    // animation
    const animation = fixture.screen.getByRole('option', {
      name: '"Pulse" Effect',
    });

    // apply animation to element
    await fixture.events.click(animation, { clickCount: 1 });

    // get original element
    const { animations: originalAnimations, elements: originalElements } =
      await fixture.renderHook(() =>
        useStory(({ state }) => ({
          animations: state.pages[startPageIndex].animations,
          elements: state.currentPage.elements,
        }))
      );
    expect(originalAnimations.length).toBe(1);

    const {
      delay: originalDelay,
      duration: originalDuration,
      type: originalType,
      targets: originalTargets,
    } = originalAnimations[0];

    // Verify that animation is assigned to correct element
    expect(originalTargets.length).toEqual(1);
    expect(
      originalElements.find((element) => element.id === originalTargets[0])
    ).not.toBeUndefined();

    // duplicate page
    await fixture.events.click(
      fixture.editor.canvas.pageActions.duplicatePage,
      { clickCount: 1 }
    );

    // get the duplicated element
    const { animations, elements } = await fixture.renderHook(() =>
      useStory(({ state }) => ({
        animations: state.pages[startPageIndex + 1].animations,
        elements: state.pages[startPageIndex + 1].elements,
      }))
    );
    expect(animations.length).toBe(1);

    const { delay, duration, type, targets } = animations[0];

    // Verify that animation values are identical
    expect(delay).toBe(originalDelay);
    expect(duration).toBe(originalDuration);
    expect(type).toBe(originalType);

    // Verify that animation is assigned to correct element
    expect(targets.length).toEqual(1);
    expect(
      elements.find((element) => element.id === targets[0])
    ).not.toBeUndefined();
  });
});
