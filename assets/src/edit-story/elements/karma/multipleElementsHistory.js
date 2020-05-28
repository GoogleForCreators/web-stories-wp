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
import { Fixture } from '../../karma';
import { useInsertElement } from '../../components/canvas';
import createSolid from '../../utils/createSolid';

const generateHelpers = (fixture) => {
  const fullBleed = fixture.container.querySelector(
    '[data-testid="fullbleed"]'
  );
  const fullBleedBB = fullBleed.getBoundingClientRect();
  const safezone = fixture.container.querySelector('[data-testid="safezone"');
  const safezoneBB = safezone.getBoundingClientRect();

  const generateHelpersForBB = (bb) => ({
    dnd: async (fromX, fromY, toX, toY) => {
      await fixture.events.mouse.seq([
        {
          type: 'move',
          x: bb.x + fromX,
          y: bb.y + fromY,
        },
        {
          type: 'down',
        },
        {
          type: 'move',
          x: bb.x + toX,
          y: bb.y + toY,
          options: { steps: 12 },
        },
        {
          type: 'up',
        },
      ]);
    },
  });

  return {
    fullBleed: generateHelpersForBB(fullBleedBB),
    safeZone: generateHelpersForBB(safezoneBB),
  };
};

// eslint-disable-next-line no-unused-vars
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

fdescribe('Multiple elements history', () => {
  let fixture;
  let helpers;

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    helpers = generateHelpers(fixture);
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render ok', () => {
    expect(
      fixture.container.querySelector('[data-testid="fullbleed"]')
    ).toBeTruthy();
  });

  describe('insert 2 shapes', () => {
    let shape1;
    let shape2;
    let shape1Frame;
    let shape2Frame;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());

      const shapeProps = {
        backgroundColor: createSolid(51, 51, 51),
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      };

      shape1 = await fixture.act(() => insertElement('shape', shapeProps));
      shape2 = await fixture.act(() =>
        insertElement('shape', { ...shapeProps, x: 100, y: 100 })
      );
      shape1Frame = fixture.querySelector(
        `[data-element-id="${shape1.id}"][data-testid="frameElement"]`
      );
      shape2Frame = fixture.querySelector(
        `[data-element-id="${shape2.id}"][data-testid="frameElement"]`
      );
    });

    it('select 2 shapes and resize them, then undo', async () => {
      // lasso select two boxes (fullBleed just for testing)
      // lasso == dnd
      await helpers.fullBleed.dnd(0, 0, 200, 200);

      // resize from bottom-right corner
      await helpers.safeZone.dnd(200, 200, 100, 100);

      // how to get updated shape1.width here?
      let shape1FrameBB = shape1Frame.getBoundingClientRect();
      expect(shape1FrameBB.width).toBe(50);
      expect(shape1FrameBB.height).toBe(50);

      let shape2FrameBB = shape2Frame.getBoundingClientRect();
      expect(shape2FrameBB.width).toBe(50);
      expect(shape2FrameBB.height).toBe(50);

      await fixture.events.keyboard.shortcut('mod+z');

      shape1FrameBB = shape1Frame.getBoundingClientRect();
      expect(shape1FrameBB.width).toBe(100);
      expect(shape1FrameBB.height).toBe(100);

      shape2FrameBB = shape2Frame.getBoundingClientRect();
      expect(shape2FrameBB.width).toBe(100);
      expect(shape2FrameBB.height).toBe(100);

      // await sleep(25000);
    });
  });
});
