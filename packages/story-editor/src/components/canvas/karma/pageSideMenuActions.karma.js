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
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { waitFor } from '@testing-library/react';

describe('PageMenu integration', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render side menu with the animation play button disabled on the first page', async () => {
    // add a new page and a text component
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    await fixture.editor.library.textTab.click();
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

    // the play button should be visible once an animation is added
    // and be enabled if on any page other than the first page
    let button = await fixture.screen.getByLabelText('Play Page Animations');
    expect(button.disabled).toBeFalsy();

    // switch to the first page delete it
    const pageAtIndex = fixture.editor.footer.carousel.pages[0].node;
    await fixture.events.click(pageAtIndex);
    await fixture.events.keyboard.down('del');
    await fixture.events.keyboard.up('del');

    // the second page should now be the first page
    // make sure the play button is visible and is disabled
    button = await fixture.screen.getByLabelText('Page Animations Disabled');
    expect(button.disabled).toBeTrue();
  });
});
