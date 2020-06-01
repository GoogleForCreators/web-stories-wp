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
import { Fixture } from '../';
import { useStory } from '../../app/story';
import { useInsertElement } from '../../components/canvas';
import createSolid from '../../utils/createSolid';
import useCanvas from '../../components/canvas/useCanvas';
import {
  dataToEditorY as dataToEditorYorg,
  dataToEditorX as dataToEditorXorg,
} from '../../units';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';

let dataToEditorX;
let dataToEditorY;

fdescribe('CUJ: Lasso selection', () => {
  let fixture;

  beforeEach(async () => {
    fixture = new Fixture();

    await fixture.render();
    await new Promise((r) => setTimeout(r, 0)); // to get correct pageSize, can be moved to render?

    const canvasContext = await fixture.renderHook(() => useCanvas());
    const {
      state: { pageSize },
    } = canvasContext;
    dataToEditorX = (x) => dataToEditorXorg(x, pageSize.width);
    dataToEditorY = (y) => dataToEditorYorg(y, pageSize.height);

    //eslint-disable-next-line no-console
    console.log(pageSize.height);
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render ok', () => {
    expect(
      fixture.container.querySelector('[data-testid="fullbleed"]')
    ).toBeTruthy();
  });

  describe('add elements', () => {
    let shapes = Array(6);
    let shapesFrames;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      const shapeProps = {
        backgroundColor: createSolid(255, 0, 0),
        x: PAGE_WIDTH - 110,
        y: 0,
        width: 110,
        height: 110,
      };

      shapes[0] = await fixture.act(() => insertElement('shape', shapeProps));
      shapes[1] = await fixture.act(() =>
        insertElement('shape', {
          ...shapeProps,
          x: PAGE_WIDTH - 220,
          y: 110,
          backgroundColor: createSolid(0, 255, 0),
        })
      );
      shapes[2] = await fixture.act(() =>
        insertElement('shape', {
          ...shapeProps,
          x: PAGE_WIDTH - 330,
          y: 220,
          backgroundColor: createSolid(0, 0, 255),
        })
      );

      shapes[3] = await fixture.act(() =>
        insertElement('shape', {
          ...shapeProps,
          x: PAGE_WIDTH - 110,
          y: PAGE_HEIGHT - 110,
          backgroundColor: createSolid(255, 0, 0),
        })
      );
      shapes[4] = await fixture.act(() =>
        insertElement('shape', {
          ...shapeProps,
          x: PAGE_WIDTH - 220,
          y: PAGE_HEIGHT - 220,
          backgroundColor: createSolid(0, 255, 0),
        })
      );
      shapes[5] = await fixture.act(() =>
        insertElement('shape', {
          ...shapeProps,
          x: PAGE_WIDTH - 330,
          y: PAGE_HEIGHT - 330,
          backgroundColor: createSolid(0, 0, 255),
        })
      );
      shapes[5] = await fixture.act(() =>
        insertElement('shape', {
          ...shapeProps,
          x: 0,
          y: PAGE_HEIGHT - 330 - 110 / 2,
          backgroundColor: createSolid(51, 51, 51),
        })
      );

      shapesFrames = shapes.map((shape) =>
        fixture.querySelector(`[data-element-id="${shape.id}"]`)
      );
    });

    describe('selection', () => {
      beforeEach(async () => {
        await fixture.events.mouse.move(0, 0);
      });

      it('should select green elements', async () => {
        await fixture.events.mouse.seq(({ moveRel, moveBy, down, up }) => [
          moveRel(shapesFrames[1], dataToEditorX(30), dataToEditorY(-30), {
            steps: 200,
          }),
          down(),
          moveRel(shapesFrames[4], '100%', '100%', { steps: 200 }),
          moveBy(dataToEditorX(-30), dataToEditorY(30), { steps: 200 }),
          up(),
        ]);

        await fixture.snapshot('green elements selected');

        const storyContext = await fixture.renderHook(() => useStory());
        expect(storyContext.state.selectedElementIds).toEqual([
          shapes[1].id,
          shapes[4].id,
        ]);
      });
    });
  });
});
