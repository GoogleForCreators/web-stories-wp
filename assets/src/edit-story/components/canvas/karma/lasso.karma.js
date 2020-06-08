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

describe('Lasso integration', () => {
  let fixture;
  let element1, element2;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    const insertElement = await fixture.renderHook(() => useInsertElement());
    element1 = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'hello world!',
        x: 40,
        y: -40,
        width: 250,
      })
    );
    element2 = await fixture.act(() =>
      insertElement('text', {
        font: TEXT_ELEMENT_DEFAULT_FONT,
        content: 'hello world!',
        x: 40,
        y: 80,
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
    expect(await getSelection()).toEqual([element2.id]);
  });

  it('should select right on the top-left corner', async () => {
    const frame1 = getFrame(element1.id);
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1, -20, -20),
      down(),
      moveBy(22, 22, { steps: 5 }),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should select right on the bottom-right corner', async () => {
    const frame1 = getFrame(element1.id);
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1, '100%', '100%'),
      moveBy(20, 20),
      down(),
      moveBy(-22, -22, { steps: 5 }),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should select two elements', async () => {
    const frame1 = getFrame(element1.id);
    const frame2 = getFrame(element2.id);
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1, '100%', '100%'),
      moveBy(2, -2),
      down(),
      moveRel(frame2, '100%', 0, { steps: 5 }),
      moveBy(-2, 2),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id, element2.id]);
  });
});
