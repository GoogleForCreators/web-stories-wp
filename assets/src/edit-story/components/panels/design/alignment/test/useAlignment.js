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
import { renderHook, act } from '@testing-library/react-hooks';
import { render, act as reactAct } from '@testing-library/react';

/**
 * Internal dependencies
 */
import DesignPanel from '../../../../inspector/design/designPanel';
import { usePresubmitHandler } from '../../../../form';
import useAlignment from '../useAlignment';

const DEFAULT_EDITOR_PAGE_WIDTH = 440;
const DEFAULT_EDITOR_PAGE_HEIGHT = 660;

function renderUseAlignement() {
  const { result } = renderHook(() => useAlignment());

  return result;
}

describe('useAlignment', () => {
  describe('single element', () => {
    let result;
    let oElement1;
    let uElement1;
    let selectedElements, updatedElementList, boundRect;
    let presubmitHandler1, presubmitHandler2;
    let registerSubmitHandler;
    let onSetProperties;
    let lastProps;

    function CustomPanel(props) {
      lastProps = { ...props };
      usePresubmitHandler(presubmitHandler1, []);
      usePresubmitHandler(presubmitHandler2, []);
      return <div />;
    }

    describe('rotated element', () => {
      beforeEach(() => {
        oElement1 = {
          id: '1',
          x: 25,
          y: 114,
          width: 160,
          height: 28,
          rotationAngle: 45,
          type: 'text',
        };
        uElement1 = {
          id: '1',
          x: 25,
          y: 114,
          width: 160,
          height: 28,
          frameX: 39,
          frameY: 62,
          frameWidth: 132,
          frameHeight: 132,
        };
        selectedElements = [oElement1];
        updatedElementList = [uElement1];
        boundRect = {
          startX: 0,
          startY: 0,
          endX: DEFAULT_EDITOR_PAGE_WIDTH,
          endY: DEFAULT_EDITOR_PAGE_HEIGHT,
          width: DEFAULT_EDITOR_PAGE_WIDTH,
          height: DEFAULT_EDITOR_PAGE_HEIGHT,
        };
        onSetProperties = jest.fn();
        presubmitHandler1 = jest.fn(({ x }) => ({ x: x + 1 }));
        presubmitHandler2 = jest.fn(({ y }) => ({ y: y + 1 }));
        registerSubmitHandler = (handler) => {
          return handler;
        };

        render(
          <DesignPanel
            panelType={CustomPanel}
            selectedElements={selectedElements}
            onSetProperties={onSetProperties}
            registerSubmitHandler={registerSubmitHandler}
          />
        );
        result = renderUseAlignement();
        const { setUpdatedSelectedElementsWithFrame } = result.current;
        act(() => setUpdatedSelectedElementsWithFrame(updatedElementList));
      });

      it('should update element x position to left corner of the page on alignleft button click', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('left', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          x: -14,
        });
      });

      it('should update element x position to right corner of the page on alignright button click', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('right', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          x: 294,
        });
      });

      it('should update element x position to center of the page on aligncenter button click', () => {
        const { handleAlignCenter } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlignCenter(boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          x: DEFAULT_EDITOR_PAGE_WIDTH / 2 - 80,
        });
      });

      it('should update element y position to top corner of the page on justifytop button click', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('top', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          y: 52,
        });
      });

      it('should update element y position to bottom corner of the page on justifybottom button click', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('bottom', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          y: 580,
        });
      });

      it('should update element y position to vertical center of the page on justifymiddle button click', () => {
        const { handleAlignMiddle } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlignMiddle(boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          y: 316,
        });
      });
    });

    describe('default element', () => {
      beforeEach(() => {
        oElement1 = {
          id: '1',
          x: 25,
          y: 114,
          width: 160,
          height: 28,
          rotationAngle: 0,
          type: 'text',
        };
        uElement1 = {
          id: '1',
          x: 25,
          y: 114,
          width: 160,
          height: 28,
          frameX: 25,
          frameY: 114,
          frameWidth: 160,
          frameHeight: 28,
        };
        selectedElements = [oElement1];
        updatedElementList = [uElement1];
        boundRect = {
          startX: 0,
          startY: 0,
          endX: DEFAULT_EDITOR_PAGE_WIDTH,
          endY: DEFAULT_EDITOR_PAGE_HEIGHT,
          width: DEFAULT_EDITOR_PAGE_WIDTH,
          height: DEFAULT_EDITOR_PAGE_HEIGHT,
        };
        onSetProperties = jest.fn();
        presubmitHandler1 = jest.fn(({ x }) => ({ x: x + 1 }));
        presubmitHandler2 = jest.fn(({ y }) => ({ y: y + 1 }));
        registerSubmitHandler = (handler) => {
          return handler;
        };

        render(
          <DesignPanel
            panelType={CustomPanel}
            selectedElements={selectedElements}
            onSetProperties={onSetProperties}
            registerSubmitHandler={registerSubmitHandler}
          />
        );
        result = renderUseAlignement();
        const { setUpdatedSelectedElementsWithFrame } = result.current;
        act(() => setUpdatedSelectedElementsWithFrame(updatedElementList));
      });

      it('should update element x position to left corner of the page', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('left', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          x: 0,
        });
      });

      it('should update element x position to right corner of the page', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('right', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          x: DEFAULT_EDITOR_PAGE_WIDTH - 160,
        });
      });

      it('should update element x position to center of the page', () => {
        const { handleAlignCenter } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlignCenter(boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          x: DEFAULT_EDITOR_PAGE_WIDTH / 2 - 80,
        });
      });

      it('should update element y position to top corner of the page', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('top', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          y: 0,
        });
      });

      it('should update element y position to bottom corner of the page', () => {
        const { handleAlign } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlign('bottom', boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          y: DEFAULT_EDITOR_PAGE_HEIGHT - 28,
        });
      });

      it('should update element y position to vertical center of the page', () => {
        const { handleAlignMiddle } = result.current;

        const { pushUpdate } = lastProps;
        reactAct(() => handleAlignMiddle(boundRect, pushUpdate));
        const {
          selectedElements: [updatedElementA],
        } = lastProps;
        expect(updatedElementA).toStrictEqual({
          ...oElement1,
          y: DEFAULT_EDITOR_PAGE_HEIGHT / 2 - 14,
        });
      });
    });
  });

  describe('multi elements', () => {
    let result;
    let oElement1, oElement2, oElement3;
    let uElement1, uElement2, uElement3;
    let selectedElements, updatedElementList, boundRect;
    let presubmitHandler1, presubmitHandler2;
    let registerSubmitHandler;
    let onSetProperties;
    let lastProps;

    function CustomPanel(props) {
      lastProps = { ...props };
      usePresubmitHandler(presubmitHandler1, []);
      usePresubmitHandler(presubmitHandler2, []);
      return <div />;
    }

    beforeEach(() => {
      oElement1 = {
        id: '1',
        x: 25,
        y: 114,
        width: 160,
        height: 28,
        rotationAngle: 45,
        type: 'text',
      };
      uElement1 = {
        id: '1',
        x: 25,
        y: 114,
        width: 160,
        height: 28,
        frameX: 39,
        frameY: 62,
        frameWidth: 132,
        frameHeight: 132,
      };
      oElement2 = {
        id: '2',
        x: 110,
        y: 268,
        rotationAngle: 0,
        width: 220,
        height: 124,
        type: 'image',
      };
      uElement2 = {
        id: '2',
        x: 110,
        y: 268,
        width: 220,
        height: 124,
        frameX: 110,
        frameY: 268,
        frameWidth: 220,
        frameHeight: 124,
      };
      oElement3 = {
        id: '3',
        x: 150,
        y: 300,
        rotationAngle: 0,
        width: 200,
        height: 100,
        type: 'image',
      };
      uElement3 = {
        id: '3',
        x: 150,
        y: 300,
        width: 200,
        height: 100,
        frameX: 150,
        frameY: 300,
        frameWidth: 200,
        frameHeight: 100,
      };
      selectedElements = [oElement1, oElement2, oElement3];
      updatedElementList = [uElement1, uElement2, uElement3];
      boundRect = {
        width: 325,
        height: 338,
        endX: 350,
        endY: 400,
        startX: 25,
        startY: 62,
      };
      onSetProperties = jest.fn();
      presubmitHandler1 = jest.fn(({ x }) => ({ x: x + 1 }));
      presubmitHandler2 = jest.fn(({ y }) => ({ y: y + 1 }));
      registerSubmitHandler = (handler) => {
        return handler;
      };

      render(
        <DesignPanel
          panelType={CustomPanel}
          selectedElements={selectedElements}
          onSetProperties={onSetProperties}
          registerSubmitHandler={registerSubmitHandler}
        />
      );
      result = renderUseAlignement();
      const { setUpdatedSelectedElementsWithFrame } = result.current;
      act(() => setUpdatedSelectedElementsWithFrame(updatedElementList));
    });

    it('should update element x position to left corner of bound rect of elements selection', () => {
      const { handleAlign } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleAlign('left', boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        x: 11,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        x: 25,
      });
    });

    it('should update element x position to right corner of bound rect of elements selection', () => {
      const { handleAlign } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleAlign('right', boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        x: 204,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        x: 130,
      });
    });

    it('should update element x position to center of the bound rect of elements selection', () => {
      const { handleAlignCenter } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleAlignCenter(boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        x: 107.5,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        x: 77.5,
      });
    });

    it('should update element y position to top corner of the bound rect of elements selection', () => {
      const { handleAlign } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleAlign('top', boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        y: 114,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        y: 62,
      });
    });

    it('should update element y position to bottom corner of the bound rect of elements selection', () => {
      const { handleAlign } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleAlign('bottom', boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        y: 320,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        y: 276,
      });
    });

    it('should update element y position to vertical center of the bound rect of elements selection', () => {
      const { handleAlignMiddle } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleAlignMiddle(boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        y: 217,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        y: 169,
      });
    });

    it('should distribute elements horizontally', () => {
      const { handleHorizontalDistribution } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleHorizontalDistribution(boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB, updatedElementC],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        x: 25,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        x: 43,
      });
      expect(updatedElementC).toStrictEqual({
        ...oElement3,
        x: 150,
      });
    });

    it('should distribute elements vertically', () => {
      const { handleVerticalDistribution } = result.current;

      const { pushUpdate } = lastProps;
      reactAct(() => handleVerticalDistribution(boundRect, pushUpdate));
      const {
        selectedElements: [updatedElementA, updatedElementB, updatedElementC],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...oElement1,
        y: 114,
      });
      expect(updatedElementB).toStrictEqual({
        ...oElement2,
        y: 237,
      });
      expect(updatedElementC).toStrictEqual({
        ...oElement3,
        y: 300,
      });
    });
  });
});
