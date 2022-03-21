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
import { TEXT_ELEMENT_DEFAULT_FONT } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { Fixture } from '../../../karma';
import { useStory } from '../../../app/story';
import { useInsertElement } from '..';

describe('Lasso integration', () => {
  let fixture;
  let element1, element2;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();

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

  async function getSelection() {
    const storyContext = await fixture.renderHook(() => useStory());
    return storyContext.state.selectedElementIds;
  }

  it('should have the last element selected by default', async () => {
    expect(await getSelection()).toEqual([element2.id]);
  });

  it('should select right on the top-left corner', async () => {
    const frame1 = fixture.editor.canvas.framesLayer.frame(element1.id);
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1.node, -20, -20),
      down(),
      moveBy(22, 22, { steps: 5 }),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should select right on the bottom-right corner', async () => {
    const frame1 = fixture.editor.canvas.framesLayer.frame(element1.id);
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1.node, '100%', '100%'),
      moveBy(20, 20),
      down(),
      moveBy(-22, -22, { steps: 5 }),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id]);
  });

  it('should select two elements', async () => {
    const frame1 = fixture.editor.canvas.framesLayer.frame(element1.id);
    const frame2 = fixture.editor.canvas.framesLayer.frame(element2.id);
    await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
      moveRel(frame1.node, '100%', '100%'),
      moveBy(2, -2),
      down(),
      moveRel(frame2.node, '100%', 0, { steps: 5 }),
      moveBy(-2, 2),
      up(),
    ]);
    expect(await getSelection()).toEqual([element1.id, element2.id]);
  });
});
