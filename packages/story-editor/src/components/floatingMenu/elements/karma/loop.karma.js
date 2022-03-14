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

describe('Design Menu: Video loop toggle', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });
    try {
      await fixture.render();
    } catch {
      // ignore
    }

    await fixture.collapseHelpCenter();

    // Add a video to stage
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(5),
      20,
      20
    );
  });

  afterEach(() => {
    fixture.restore();
  });

  const getSelectedElementLoop = async () => {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElements[0].loop || false;
  };

  it('should render the checkbox as unchecked if the video is not set to loop', async () => {
    expect(await getSelectedElementLoop()).toBe(false);

    expect(fixture.editor.canvas.designMenu.loop.checked).toBe(false);
  });

  it('should render the checkbox as checked if the video is set to loop', async () => {
    // Open style pane
    await fixture.events.click(fixture.editor.inspector.designTab);

    // Toggle the loop property using the design panel
    await fixture.events.click(
      fixture.editor.inspector.designPanel.videoOptions.loop
    );

    expect(await getSelectedElementLoop()).toBe(true);

    expect(fixture.editor.canvas.designMenu.loop.checked).toBe(true);
  });

  it('should toggle the element loop flag when pressed', async () => {
    expect(await getSelectedElementLoop()).toBe(false);
    expect(fixture.editor.canvas.designMenu.loop.checked).toBe(false);

    await fixture.events.click(fixture.editor.canvas.designMenu.loop);

    expect(await getSelectedElementLoop()).toBe(true);
    expect(fixture.editor.canvas.designMenu.loop.checked).toBe(true);

    await fixture.events.click(fixture.editor.canvas.designMenu.loop);

    expect(await getSelectedElementLoop()).toBe(false);
    expect(fixture.editor.canvas.designMenu.loop.checked).toBe(false);
  });
});
