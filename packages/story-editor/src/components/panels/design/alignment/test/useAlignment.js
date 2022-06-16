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
import { renderHook } from '@testing-library/react';
import { PAGE_WIDTH, PAGE_HEIGHT } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import useAlignment from '../useAlignment';

const WIDTH = 40;
const DESIGN_GUIDE = 48;
const ROTATED_OFFSET = 8; // Math.floor(Math.sqrt(WIDTH^2/2) - WIDTH/2)
const SHAPE = {
  width: WIDTH,
  height: WIDTH,
  rotationAngle: 0,
  type: 'shape',
};
const TOPLEFT_SHAPE = {
  ...SHAPE,
  id: '1',
  x: DESIGN_GUIDE,
  y: 0,
};
const TOPLEFT_ROTATED_SHAPE = {
  ...TOPLEFT_SHAPE,
  id: '1r',
  rotationAngle: 45,
};
const CENTER_SHAPE = {
  ...SHAPE,
  id: '2',
  x: (PAGE_WIDTH - WIDTH) / 2,
  y: (PAGE_HEIGHT - WIDTH) / 2,
};
const CENTER_ROTATED_SHAPE = {
  ...CENTER_SHAPE,
  id: '2r',
  rotationAngle: 45,
};
const BOTTOMRIGHT_SHAPE = {
  ...SHAPE,
  id: '3',
  x: PAGE_WIDTH - 2 * WIDTH - DESIGN_GUIDE,
  y: PAGE_HEIGHT - 2 * WIDTH,
};

function renderUseAlignment(selectedElements) {
  const updateElements = jest.fn();
  const {
    result: { current },
  } = renderHook(() => useAlignment({ selectedElements, updateElements }));
  const getResult = () => {
    const updateFunction = updateElements.mock.calls[0][0];
    return selectedElements.map(updateFunction);
  };
  return {
    ...current,
    getResult,
  };
}

describe('useAlignment', () => {
  describe('with a single element', () => {
    describe('that is not rotated', () => {
      it('should not be distributable', () => {
        const { isDistributionEnabled } = renderUseAlignment([CENTER_SHAPE]);
        expect(isDistributionEnabled).toBe(false);
      });
      it('should attempt to set x to 0 when aligning left', () => {
        const hookResult = renderUseAlignment([CENTER_SHAPE]);
        const { handleAlignLeft, getResult } = hookResult;
        handleAlignLeft();
        const [leftAlignedShape] = getResult();
        expect(leftAlignedShape).toMatchObject({
          x: 0,
        });
      });
      it('should attempt to set x to (page width - object width)/2 when aligning center', () => {
        const hookResult = renderUseAlignment([TOPLEFT_SHAPE]);
        const { handleAlignCenter, getResult } = hookResult;
        handleAlignCenter();
        const [centerAlignedShape] = getResult();
        expect(centerAlignedShape).toMatchObject({
          x: (PAGE_WIDTH - WIDTH) / 2,
        });
      });
      it('should attempt to set x to (page width - object width) when aligning right', () => {
        const hookResult = renderUseAlignment([CENTER_SHAPE]);
        const { handleAlignRight, getResult } = hookResult;
        handleAlignRight();
        const [rightAlignedShape] = getResult();
        expect(rightAlignedShape).toMatchObject({
          x: PAGE_WIDTH - WIDTH,
        });
      });
      it('should attempt to set y to 0 when aligning top', () => {
        const hookResult = renderUseAlignment([CENTER_SHAPE]);
        const { handleAlignTop, getResult } = hookResult;
        handleAlignTop();
        const [topAlignedShape] = getResult();
        expect(topAlignedShape).toMatchObject({
          y: 0,
        });
      });
      it('should attempt to set y to (page height - object height)/2 when aligning middle', () => {
        const hookResult = renderUseAlignment([CENTER_SHAPE]);
        const { handleAlignMiddle, getResult } = hookResult;
        handleAlignMiddle();
        const [middleAlignedShape] = getResult();
        expect(middleAlignedShape).toMatchObject({
          y: (PAGE_HEIGHT - WIDTH) / 2,
        });
      });
      it('should attempt to set y to (page height - object height) when aligning bottom', () => {
        const hookResult = renderUseAlignment([TOPLEFT_SHAPE]);
        const { handleAlignBottom, getResult } = hookResult;
        handleAlignBottom();
        const [bottomAlignedShape] = getResult();
        expect(bottomAlignedShape).toMatchObject({
          y: PAGE_HEIGHT - WIDTH,
        });
      });
    });
    describe('that is rotated', () => {
      it('should not be distributable', () => {
        const { isDistributionEnabled } = renderUseAlignment([CENTER_SHAPE]);
        expect(isDistributionEnabled).toBe(false);
      });
      it('should attempt to set x to OFFSET when aligning left', () => {
        const hookResult = renderUseAlignment([CENTER_ROTATED_SHAPE]);
        const { handleAlignLeft, getResult } = hookResult;
        handleAlignLeft();
        const [leftAlignedShape] = getResult();
        expect(leftAlignedShape).toMatchObject({
          x: ROTATED_OFFSET,
        });
      });
      it('should attempt to set x to (page width - object width)/2 when aligning center', () => {
        const hookResult = renderUseAlignment([TOPLEFT_ROTATED_SHAPE]);
        const { handleAlignCenter, getResult } = hookResult;
        handleAlignCenter();
        const [centerAlignedShape] = getResult();
        expect(centerAlignedShape).toMatchObject({
          x: (PAGE_WIDTH - WIDTH) / 2,
        });
      });
      it('should attempt to set x to (page width - object width - offset) when aligning right', () => {
        const hookResult = renderUseAlignment([CENTER_ROTATED_SHAPE]);
        const { handleAlignRight, getResult } = hookResult;
        handleAlignRight();
        const [rightAlignedShape] = getResult();
        expect(rightAlignedShape).toMatchObject({
          x: PAGE_WIDTH - WIDTH - ROTATED_OFFSET,
        });
      });
      it('should attempt to set y to offset when aligning top', () => {
        const hookResult = renderUseAlignment([CENTER_ROTATED_SHAPE]);
        const { handleAlignTop, getResult } = hookResult;
        handleAlignTop();
        const [topAlignedShape] = getResult();
        expect(topAlignedShape).toMatchObject({
          y: ROTATED_OFFSET,
        });
      });
      it('should attempt to set y to (page height - object height)/2 when aligning middle', () => {
        const hookResult = renderUseAlignment([CENTER_ROTATED_SHAPE]);
        const { handleAlignMiddle, getResult } = hookResult;
        handleAlignMiddle();
        const [middleAlignedShape] = getResult();
        expect(middleAlignedShape).toMatchObject({
          y: (PAGE_HEIGHT - WIDTH) / 2,
        });
      });
      it('should attempt to set y to (page height - object height - offset) when aligning bottom', () => {
        const hookResult = renderUseAlignment([TOPLEFT_ROTATED_SHAPE]);
        const { handleAlignBottom, getResult } = hookResult;
        handleAlignBottom();
        const [bottomAlignedShape] = getResult();
        expect(bottomAlignedShape).toMatchObject({
          y: PAGE_HEIGHT - WIDTH - ROTATED_OFFSET,
        });
      });
    });
  });
  describe('with two elements', () => {
    it('should not be distributable', () => {
      const hookResult = renderUseAlignment([TOPLEFT_SHAPE, CENTER_SHAPE]);
      const { isDistributionEnabled } = hookResult;
      expect(isDistributionEnabled).toBe(false);
    });
    it('should attempt to set x to min x when aligning left', () => {
      const hookResult = renderUseAlignment([TOPLEFT_SHAPE, CENTER_SHAPE]);
      const expectedX = TOPLEFT_SHAPE.x;
      const { handleAlignLeft, getResult } = hookResult;
      handleAlignLeft();
      const shapes = getResult();
      shapes.forEach((shape) => expect(shape).toMatchObject({ x: expectedX }));
    });
    it('should attempt to set x to middle x when aligning center', () => {
      const hookResult = renderUseAlignment([TOPLEFT_SHAPE, CENTER_SHAPE]);
      const expectedX =
        TOPLEFT_SHAPE.x + (CENTER_SHAPE.x - TOPLEFT_SHAPE.x) / 2;
      const { handleAlignCenter, getResult } = hookResult;
      handleAlignCenter();
      const shapes = getResult();
      shapes.forEach((shape) => expect(shape).toMatchObject({ x: expectedX }));
    });
    it('should attempt to set x to max x when aligning right', () => {
      const hookResult = renderUseAlignment([TOPLEFT_SHAPE, CENTER_SHAPE]);
      const expectedX = CENTER_SHAPE.x;
      const { handleAlignRight, getResult } = hookResult;
      handleAlignRight();
      const shapes = getResult();
      shapes.forEach((shape) => expect(shape).toMatchObject({ x: expectedX }));
    });
    it('should attempt to set y to min y when aligning top', () => {
      const hookResult = renderUseAlignment([TOPLEFT_SHAPE, CENTER_SHAPE]);
      const expectedY = TOPLEFT_SHAPE.y;
      const { handleAlignTop, getResult } = hookResult;
      handleAlignTop();
      const shapes = getResult();
      shapes.forEach((shape) => expect(shape).toMatchObject({ y: expectedY }));
    });
    it('should attempt to set y to middle y when aligning middle', () => {
      const hookResult = renderUseAlignment([TOPLEFT_SHAPE, CENTER_SHAPE]);
      const expectedY =
        TOPLEFT_SHAPE.y + (CENTER_SHAPE.y - TOPLEFT_SHAPE.y) / 2;
      const { handleAlignMiddle, getResult } = hookResult;
      handleAlignMiddle();
      const shapes = getResult();
      shapes.forEach((shape) => expect(shape).toMatchObject({ y: expectedY }));
    });
    it('should attempt to set y to max y when aligning bottom', () => {
      const hookResult = renderUseAlignment([TOPLEFT_SHAPE, CENTER_SHAPE]);
      const expectedY = CENTER_SHAPE.y;
      const { handleAlignBottom, getResult } = hookResult;
      handleAlignBottom();
      const shapes = getResult();
      shapes.forEach((shape) => expect(shape).toMatchObject({ y: expectedY }));
    });
  });
  describe('with three elements', () => {
    it('should be distributable', () => {
      const hookResult = renderUseAlignment([
        TOPLEFT_SHAPE,
        CENTER_SHAPE,
        BOTTOMRIGHT_SHAPE,
      ]);
      const { isDistributionEnabled } = hookResult;
      expect(isDistributionEnabled).toBe(true);
    });
    it('should attempt to set middle element x to center when distributing horizontally', () => {
      const hookResult = renderUseAlignment([
        TOPLEFT_SHAPE,
        CENTER_SHAPE,
        BOTTOMRIGHT_SHAPE,
      ]);
      const expectedX =
        TOPLEFT_SHAPE.x + (BOTTOMRIGHT_SHAPE.x - TOPLEFT_SHAPE.x) / 2;
      const { handleHorizontalDistribution, getResult } = hookResult;
      handleHorizontalDistribution();
      const shapes = getResult();
      expect(shapes[1]).toMatchObject({ x: expectedX });
    });
    it('should attempt to set middle element y to center when distributing vertically', () => {
      const hookResult = renderUseAlignment([
        TOPLEFT_SHAPE,
        CENTER_SHAPE,
        BOTTOMRIGHT_SHAPE,
      ]);
      const expectedY =
        TOPLEFT_SHAPE.y + (BOTTOMRIGHT_SHAPE.y - TOPLEFT_SHAPE.y) / 2;
      const { handleVerticalDistribution, getResult } = hookResult;
      handleVerticalDistribution();
      const shapes = getResult();
      expect(shapes[1]).toMatchObject({ y: expectedY });
    });
  });
});
