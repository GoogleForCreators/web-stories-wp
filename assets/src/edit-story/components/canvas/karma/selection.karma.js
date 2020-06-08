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
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';
import { useInsertElement } from '..';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';

describe('Selection integration', () => {
  let fixture;
  let element1;
  let fullbleed;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    fullbleed = fixture.container.querySelector('[data-testid="fullbleed"]');

    const insertElement = await fixture.renderHook(() => useInsertElement());
    element1 = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'hello world!',
        x: 0,
        y: 40,
        width: 250,
      })
    );
  });

  afterEach(() => {
    fixture.restore();
  });

  function getFrame(elementId) {
    return fixture.querySelector(
      `[data-element-id="${elementId}"] [data-testid="textFrame"]`
    );
  }

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  it('should have the last element selected by default', async () => {
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should show the selection lines when out of page area', async () => {
    const frame1 = getFrame(element1.id);
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1, 5, 5),
      down(),
      moveBy(-20, 0, { steps: 5 }),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id]);
    await fixture.snapshot();
  });

  it('should show the selection under the page menu', async () => {
    const frame1 = getFrame(element1.id);
    const fbcr = frame1.getBoundingClientRect();
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1, 5, 5),
      down(),
      moveBy(
        0,
        fullbleed.getBoundingClientRect().bottom -
          fbcr.bottom +
          fbcr.height -
          5,
        { steps: 5 }
      ),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id]);
    await fixture.snapshot();
  });
});
