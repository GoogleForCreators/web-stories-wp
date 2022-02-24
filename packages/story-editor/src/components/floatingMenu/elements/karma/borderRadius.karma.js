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
import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';

describe('Design Menu: Border radius', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    await fixture.render();

    await fixture.collapseHelpCenter();
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelectedElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0];
  };

  it('should not render for non-shapes', async () => {
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );

    expect(fixture.editor.canvas.designMenu.borderRadius).toBeNull();
  });

  it('should not render for non-rectangular shapes', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));

    expect(fixture.editor.canvas.designMenu.borderRadius).toBeNull();
  });

  it('should render for rectangular shape but only while radii are locked', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    expect(fixture.editor.canvas.designMenu.borderRadius).not.toBeNull();

    const panel = fixture.editor.inspector.designPanel.sizePosition;
    await fixture.events.click(panel.lockBorderRadius);

    expect(fixture.editor.canvas.designMenu.borderRadius).toBeNull();
  });

  it('should display the same radius as entered in the design panel', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    const panel = fixture.editor.inspector.designPanel.sizePosition;
    await fixture.events.click(panel.radius(), { clickCount: 3 });
    await fixture.events.keyboard.type('10');
    await fixture.events.keyboard.press('tab');

    expect(fixture.editor.canvas.designMenu.borderRadius.value).toBe('10');
  });

  it('should update the border-radius on the selected element when typing', async () => {
    await fixture.events.click(fixture.editor.library.shapesTab);
    await waitFor(() => fixture.editor.library.shapes);

    await fixture.events.click(
      fixture.editor.library.shapes.shape('Rectangle')
    );

    await fixture.events.click(fixture.editor.canvas.designMenu.borderRadius, {
      clickCount: 3,
    });
    await fixture.events.keyboard.type('10');
    await fixture.events.keyboard.press('tab');

    const element = await getSelectedElement();
    expect(element.borderRadius.topLeft).toBe(10);
  });
});
