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
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../../karma/fixture';
import { useStory } from '../../../../../app';

describe('Animation Panel', function () {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  async function getCurrntPage() {
    const {
      state: { currentPage },
    } = await fixture.renderHook(() => useStory());
    return currentPage;
  }

  it('should render the animation panel when an element is selected.', async function () {
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );
    const panel = fixture.editor.sidebar.designPanel.animation;
    expect(panel).not.toBeNull();
  });

  it('should not render the animation panel when multiple elements are selected.', async function () {
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    // add shape to canvas
    await fixture.editor.library.shapesTab.click();
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));

    // add text to canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await fixture.editor.canvas.framesLayer.waitFocusedWithin();

    // select both text and shape elements
    await fixture.events.keyboard.down('Shift');
    const triangle = fixture.editor.canvas.framesLayer.frames[1].node;
    await fixture.events.click(triangle);
    await fixture.events.keyboard.up('Shift');

    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );
    const panel = await fixture.screen.queryByRole('region', {
      name: /^Animation$/,
    });
    expect(panel).toBeNull();
  });

  // TODO #6953
  // eslint-disable-next-line jasmine/no-disabled-tests
  xit('can click the animation chooser and select an effect.', async function () {
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );
    const panel = fixture.editor.sidebar.designPanel.animation;

    const effectChooser = panel.effectChooser;
    await fixture.events.click(effectChooser);
    await fixture.events.sleep(300);
    const fadeIn = await fixture.screen.getByRole('option', {
      name: /^"Fade In" Effect$/,
    });
    await fixture.events.click(fadeIn);
    await fixture.events.sleep(300);
    expect(effectChooser.innerText).toBe('Fade In');
  });

  it('replaces an existing effect with a new one.', async function () {
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );
    const panel = fixture.editor.sidebar.designPanel.animation;

    const effectChooser = panel.effectChooser;
    await fixture.events.click(effectChooser);

    await fixture.events.click(
      fixture.screen.getByRole('option', { name: /^"Fade In" Effect$/ })
    );

    expect(effectChooser.innerText).toBe('Fade In');

    await fixture.events.click(
      fixture.screen.getByRole('option', { name: /^"Drop" Effect$/ })
    );

    expect(effectChooser.innerText).toBe('Drop');
  });

  it('plays the animation when a control in the panel is changed.', async function () {
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });
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
    await fixture.events.sleep(300);

    const { animationState } = await fixture.renderHook(() =>
      useStory(({ state }) => {
        return {
          animationState: state.animationState,
        };
      })
    );

    expect(animationState).toBe(STORY_ANIMATION_STATE.PLAYING_SELECTED);
  });

  it('should render the animation panel with warning if on the first page.', async function () {
    // add text to the canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });

    // navigate to the animations panel
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );

    // A warning should be displayed per AMP spec - animations are disabled on first page
    const contrastWarning = await fixture.screen.findByTestId(
      'warningContainer'
    );

    await expectAsync(contrastWarning).toHaveNoViolations();
  });

  it('should render the animation panel with effectChooser input disabled if on the first page.', async function () {
    // add text to the canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });

    // navigate to animations panel
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );

    const panel = fixture.editor.sidebar.designPanel.animation;
    // the effectChooser should be disabled on the first page
    expect(panel.effectChooser.disabled).toBeTrue();
  });

  fit('should render the animation panel with inputs disabled when page becomes the first page', async function () {
    const { id: firstPageId } = await getCurrntPage();
    // create a new page with in the story
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    const { id: secondPageId } = await getCurrntPage();

    // add text to the canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    await waitFor(() => {
      if (!fixture.editor.canvas.framesLayer.frames[1].node) {
        throw new Error('node not ready');
      }
    });

    // navigate to the animations panel
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.animationSection
    );

    // get the second pages panel info
    // animations should be enabled on all pages other than the first page
    let effectChooser =
      fixture.editor.sidebar.designPanel.animation.effectChooser;
    expect(effectChooser.disabled).toBeFalsy();

    // set the text animation
    await fixture.events.click(effectChooser, { clickCount: 1 });

    await fixture.events.click(
      fixture.screen.getByRole('option', { name: /^"Fade In" Effect$/ })
    );
    expect(effectChooser.innerText).toBe('Fade In');

    // switch to the first page
    const pageAtIndex = fixture.editor.footer.carousel.pages[0].node;
    await fixture.events.click(pageAtIndex);

    const { id: shouldBeFirstPageId } = await getCurrntPage();
    expect(shouldBeFirstPageId).toBe(firstPageId);

    // delete the first page making the second page move to the first page
    await fixture.events.keyboard.down('del');
    await fixture.events.keyboard.up('del');

    const { id: shouldBeSecondPageId } = await getCurrntPage();
    expect(shouldBeSecondPageId).toBe(secondPageId);

    // select the text component in the canvas
    await fixture.events.click(
      fixture.editor.canvas.framesLayer.frames[1].node
    );

    effectChooser = fixture.editor.sidebar.designPanel.animation.effectChooser;

    // the animation information should still be present in the animation panel but not editable
    expect(effectChooser.disabled).toBeTrue();
    const duration = await fixture.screen.getByLabelText('Duration');
    const delay = await fixture.screen.getByLabelText('Delay');
    expect(duration.disabled).toBeTrue();
    expect(delay.disabled).toBeTrue();

    // A warning should be displayed per AMP spec - animations are disabled on first page
    const contrastWarning = await fixture.screen.findByTestId(
      'warningContainer'
    );
    await expectAsync(contrastWarning).toHaveNoViolations();
  });
});
