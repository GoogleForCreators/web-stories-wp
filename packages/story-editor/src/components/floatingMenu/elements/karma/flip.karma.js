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
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';

describe('Design Menu: Flip toggles', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    await fixture.render();

    await fixture.collapseHelpCenter();

    // Add an image to stage
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelectedElement = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0];
  };

  it('should render the buttons as untoggled if current selection is not flipped', async () => {
    // Check that actual element properties have flips set to false
    const { flip: { vertical = false, horizontal = false } = {} } =
      await getSelectedElement();
    expect(vertical).toBe(false);
    expect(horizontal).toBe(false);

    // Check that the design menu buttons are untoggled
    expect(fixture.editor.canvas.designMenu.flipVertical.checked).toBe(false);
    expect(fixture.editor.canvas.designMenu.flipHorizontal.checked).toBe(false);
  });

  it('should render the buttons as toggled if current selection is flipped both ways', async () => {
    // Toggle the flips using the design panel
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.sizePosition.flipHorizontal
    );
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.sizePosition.flipVertical
    );

    // Check that actual element properties have flips set to true
    const { flip: { vertical = false, horizontal = false } = {} } =
      await getSelectedElement();
    expect(vertical).toBe(true);
    expect(horizontal).toBe(true);

    // Check that the design menu buttons are toggled
    expect(fixture.editor.canvas.designMenu.flipVertical.checked).toBe(true);
    expect(fixture.editor.canvas.designMenu.flipHorizontal.checked).toBe(true);
  });

  it('should correctly flip the element if the vertical flip button is clicked', async () => {
    // Check that actual element property have vertical flip set to false
    const { flip: { vertical = false } = {} } = await getSelectedElement();
    expect(vertical).toBe(false);

    // Check that the design menu button is untoggled
    expect(fixture.editor.canvas.designMenu.flipVertical.checked).toBe(false);

    // Click the toggle
    await fixture.events.click(
      fixture.editor.canvas.designMenu.flipVertical.node
    );

    // Check that actual element property have vertical flip set to true
    const { flip: { vertical: verticalAfter = false } = {} } =
      await getSelectedElement();
    expect(verticalAfter).toBe(true);

    // Check that the design menu button is toggled
    expect(fixture.editor.canvas.designMenu.flipVertical.checked).toBe(true);
  });

  it('should correctly flip the element if the horizontal flip button is clicked', async () => {
    // Check that actual element property have horizontal flip set to false
    const { flip: { horizontal = false } = {} } = await getSelectedElement();
    expect(horizontal).toBe(false);

    // Check that the design menu button is untoggled
    expect(fixture.editor.canvas.designMenu.flipHorizontal.checked).toBe(false);

    // Click the toggle
    await fixture.events.click(
      fixture.editor.canvas.designMenu.flipHorizontal.node
    );

    // Check that actual element property have horizontal flip set to true
    const { flip: { horizontal: horizontalAfter = false } = {} } =
      await getSelectedElement();
    expect(horizontalAfter).toBe(true);

    // Check that the design menu button is toggled
    expect(fixture.editor.canvas.designMenu.flipHorizontal.checked).toBe(true);
  });
});
