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
import useInsertElement from '../useInsertElement';
import createSolidFromString from '../../../utils/createSolidFromString';

describe('Canvas Keyboard Shortcuts', () => {
  let fixture;
  let element1;
  let element2;
  let element3;
  let fullbleed;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();

    fullbleed = fixture.container.querySelector('[data-testid="fullbleed"]');

    const insertElement = await fixture.renderHook(() => useInsertElement());
    element1 = await fixture.act(() =>
      insertElement('shape', {
        backgroundColor: createSolidFromString('#f00123'),
        mask: { type: 'rectangle' },
        x: 10,
        y: 10,
        width: 50,
        height: 50,
      })
    );
    element2 = await fixture.act(() =>
      insertElement('shape', {
        backgroundColor: createSolidFromString('#f00123'),
        mask: { type: 'rectangle' },
        x: 100,
        y: 100,
        width: 50,
        height: 50,
      })
    );
    element3 = await fixture.act(() =>
      insertElement('shape', {
        backgroundColor: createSolidFromString('#f00123'),
        mask: { type: 'rectangle' },
        x: 200,
        y: 200,
        width: 50,
        height: 50,
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
    await fixture.events.focus(fullbleed);
    await fixture.events.keyboard.shortcut('mod+a');
    expect(await getSelection()).toEqual([
      element1.id,
      element2.id,
      element3.id,
    ]);
  });
});
