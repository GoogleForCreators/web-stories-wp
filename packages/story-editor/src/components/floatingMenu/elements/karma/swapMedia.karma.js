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

describe('Design Menu: Swap Media', () => {
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

  it('should not render for shapes, text', async () => {
    // Add a shape.
    await fixture.events.click(fixture.editor.library.shapesTab);
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));
    expect(() => fixture.editor.canvas.designMenu.swapMedia).toThrow();

    // Add a text.
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));
    expect(() => fixture.editor.canvas.designMenu.swapMedia).toThrow();
  });

  it('should render for video and image', async () => {
    // Add an image.
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );
    expect(fixture.editor.canvas.designMenu.swapMedia).not.toBeNull();

    // Add video.
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(5),
      20,
      20
    );
    expect(fixture.editor.canvas.designMenu.swapMedia).not.toBeNull();
  });
});
