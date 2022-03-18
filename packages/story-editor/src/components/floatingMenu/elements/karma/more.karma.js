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
import STICKERS from '@googleforcreators/stickers';
/**
 * Internal dependencies
 */
import { Fixture } from '../../../../karma';

const stickerTestType = Object.keys(STICKERS)[0];

describe('More button', () => {
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

  it('media element: should focus the size and position panel when the more button is clicked', async () => {
    // add image to canvas
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );

    // click more button
    await fixture.events.click(fixture.editor.canvas.designMenu.more);

    // verify that first input in size and position panel is focused
    expect(document.activeElement).toBe(fixture.editor.inspector.designTab);
  });

  it('text element: should focus the size and position panel when the more button is clicked', async () => {
    // add text to canvas
    await fixture.editor.library.textTab.click();
    await fixture.events.click(fixture.editor.library.text.preset('Paragraph'));

    // click more button
    await fixture.events.click(fixture.editor.canvas.designMenu.more);

    // verify that first input in size and position panel is focused
    expect(document.activeElement).toBe(fixture.editor.inspector.designTab);
  });

  it('shape element: should focus the size and position panel when the more button is clicked', async () => {
    // add text to canvas
    await fixture.editor.library.shapesTab.click();
    await fixture.events.click(fixture.editor.library.shapes.shape('Triangle'));

    // click more button
    await fixture.events.click(fixture.editor.canvas.designMenu.more);

    // verify that first input in size and position panel is focused
    expect(document.activeElement).toBe(fixture.editor.inspector.designTab);
  });

  it('sticker element: should focus the size and position panel when the more button is clicked', async () => {
    // add text to canvas
    await fixture.editor.library.shapesTab.click();
    await fixture.events.click(
      fixture.editor.library.shapes.sticker(stickerTestType)
    );

    // click more button
    await fixture.events.click(fixture.editor.canvas.designMenu.more);

    // verify that first input in size and position panel is focused
    expect(document.activeElement).toBe(fixture.editor.inspector.designTab);
  });
});
