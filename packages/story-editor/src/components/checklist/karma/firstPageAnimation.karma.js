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

describe('firstPageAnimation', function () {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should see First Page Animation text in checklist design panel', async function () {
    // add a second page
    await fixture.events.click(fixture.editor.canvas.pageActions.addPage);
    await fixture.editor.library.textTab.click();

    // add text component
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

    // move to the first page
    const previousPageButton = fixture.screen.getByRole('button', {
      name: /Previous Page/,
    });
    await fixture.events.click(previousPageButton, { clickCount: 1 });

    // delete the first page making the second page move to the first page
    const deleteBtn = fixture.screen.getByRole('button', {
      name: /^Delete Page$/,
    });
    await fixture.events.click(deleteBtn);

    // now the checklist should have the FirstPageAnimation checklist item
    // open the checklist
    await fixture.events.click(fixture.editor.checklist.toggleButton);
    // wait for animation
    await fixture.events.sleep(500);

    // open the Design tab
    await fixture.events.click(fixture.editor.checklist.designTab);
    // check for firstPageAnimation footer
    const seeFirstPageAnimationText = fixture.screen.getByText(
      new RegExp(`^${DESIGN_COPY.firstPageAnimation.footer}`)
    );

    expect(seeFirstPageAnimationText).toBeDefined();
  });
});
