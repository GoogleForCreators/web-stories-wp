/*
 * Copyright 2022 Google LLC
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
import { DESIGN_COPY } from '../constants';
import { useStory } from '../../../app/story';

describe('firstPageAnimation', function () {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

    // adding animations to the first page
    await addNewPage();
    await addElementWithAnimation();
    await removeFirstPage();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function addNewPage() {
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    await fixture.editor.library.textTab.click();
  }

  async function addElementWithAnimation() {
    // add element
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });

    // add animation
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );
    const panel = fixture.editor.sidebar.designPanel.animation;
    const effectChooser = panel.effectChooser;

    await fixture.events.click(effectChooser, { clickCount: 1 });

    await fixture.events.click(
      fixture.screen.getByRole('option', { name: /^"Fade In" Effect$/ })
    );
  }

  async function removeFirstPage() {
    // switch to the first page
    const pageAtIndex = fixture.editor.footer.carousel.pages[0].node;
    await fixture.events.click(pageAtIndex);

    // delete the first page making the second page move to the first page
    const deleteBtn = fixture.screen.getByRole('button', {
      name: /^Delete Page$/,
    });
    await fixture.events.click(deleteBtn);
  }

  async function openCheckList() {
    // now the checklist should have the FirstPageAnimation checklist item
    // open the checklist
    await fixture.events.click(fixture.editor.checklist.toggleButton);
    // wait for animation
    await fixture.events.sleep(500);
  }

  async function getCurrentPage() {
    return await fixture.renderHook(() =>
      useStory(({ state: { currentPage } }) => currentPage)
    );
  }

  fit('should see First Page Animation text in checklist design panel', async function () {
    await openCheckList();
    // open the Design tab
    await fixture.events.click(fixture.editor.checklist.designTab);
    // check for firstPageAnimation footer
    const seeFirstPageAnimationText = fixture.screen.getByText(
      new RegExp(`^${DESIGN_COPY.firstPageAnimation.footer}`)
    );

    expect(seeFirstPageAnimationText).toBeDefined();
  });

  fit('should remove all first page animations when "Remove Animations" button is clicked', async () => {
    // check for first page animations
    let page = await getCurrentPage();
    expect(page.animations.length).toBe(1);
    await openCheckList();

    // check for remove animations button
    const seeRemoveAnimations = fixture.screen.getByText(
      new RegExp(`^Remove Animations`)
    );
    expect(seeRemoveAnimations).toBeDefined();

    const removeAnimationsBtn = fixture.screen.getByRole('button', {
      name: /^Remove Animations$/,
    });

    await fixture.events.click(removeAnimationsBtn);
    page = await getCurrentPage();
    // check that the first page animations are removed
    expect(Boolean(page.animations?.length)).toBeFalsy();
  });
});
