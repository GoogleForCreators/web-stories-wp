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
import { useStory } from '../../../../app';
import { Fixture } from '../../../../karma';

describe('Design Menu: Opacity Input', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();
    fixture.setFlags({ floatingMenu: true });

    await fixture.render();
    await fixture.collapseHelpCenter();

    // add image to canvas
    await fixture.events.mouse.clickOn(
      fixture.editor.library.media.item(0),
      20,
      20
    );
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should update the opacity', async () => {
    // check initial opacity
    const initialOpacity = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1].opacity)
    );

    expect(initialOpacity).toBe(100);

    // click opacity input
    await fixture.events.click(fixture.editor.canvas.designMenu.opacity);

    // update opacity
    await fixture.events.keyboard.type('50');
    await fixture.events.keyboard.press('tab');

    // verify updated opacity
    const finalOpacity = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1].opacity)
    );

    expect(finalOpacity).toBe(50);
  });

  it('should not update the opacity to a number greater than 100', async () => {
    // check initial opacity
    const initialOpacity = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1].opacity)
    );

    expect(initialOpacity).toBe(100);

    // click opacity input
    await fixture.events.click(fixture.editor.canvas.designMenu.opacity);

    // update opacity
    await fixture.events.keyboard.type('200');
    await fixture.events.keyboard.press('tab');

    // verify updated opacity
    const finalOpacity = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1].opacity)
    );

    expect(finalOpacity).toBe(100);
  });
});
