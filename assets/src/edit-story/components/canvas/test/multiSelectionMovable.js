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
import { render } from '@testing-library/react';
import Moveable from 'react-moveable';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../edit-story/units';
import withOverlay from '../../overlay/withOverlay';
import CanvasContext from '../context';
import Selection from '../selection';
import StoryContext from '../../../app/story/context';
import TransformProvider from '../../transform/transformProvider';

jest.mock('react-moveable', () => jest.fn(() => ({ children }) => children));

const pageSize = { width: 100, height: 100 };

const element1 = { id: '1', type: 'text', x: 0, y: 0 };
const element2 = { id: '2', type: 'text', x: 1, y: 1 };

const WrapperWithRef = ({ children }, ref) => (
  <div ref={ref}>
    <TransformProvider>
      <UnitsProvider pageSize={pageSize}>{children}</UnitsProvider>
    </TransformProvider>
  </div>
);
const Wrapper = withOverlay(forwardRef(WrapperWithRef));

WrapperWithRef.propTypes = {
  children: PropTypes.node,
};

describe('multiSelectionMovable', () => {
  let updateElementsById;
  let updateSelectedElements;
  let target1;
  let target2;
  let storyContext;
  let canvasContext;

  beforeEach(() => {
    updateElementsById = jest.fn();
    updateSelectedElements = jest.fn();
    target1 = document.createElement('div');
    target2 = document.createElement('div');

    storyContext = {
      state: { selectedElements: [element1, element2] },
      actions: { updateElementsById, updateSelectedElements },
    };
    canvasContext = {
      state: {
        pageSize,
        nodesById: {
          '1': target1,
          '2': target2,
        },
        fullbleedContainer: document.body,
      },
      actions: { handleSelectElement: jest.fn() },
    };
  });

  function arrange() {
    return render(
      <StoryContext.Provider value={storyContext}>
        <CanvasContext.Provider value={canvasContext}>
          <Selection />
        </CanvasContext.Provider>
      </StoryContext.Provider>,
      { wrapper: Wrapper }
    );
  }

  function performRotation(rotateTo) {
    const moveable = Moveable.mock.calls[Moveable.mock.calls.length - 1][0];
    moveable.onRotateGroupStart({ events: [{ set: () => {} }] });
    moveable.onRotateGroup({
      events: [
        {
          target: target1,
          beforeRotate: rotateTo,
          drag: { beforeTranslate: [0, 0] },
        },
        {
          target: target2,
          beforeRotate: rotateTo,
          drag: { beforeTranslate: [0, 0] },
        },
      ],
    });
    moveable.onRotateGroupEnd({ targets: [target1, target2] });
  }

  const rotateCases = [
    ['normally', { rotateTo: 45, expectedRotationAngle: 45 }],
    ['through 360 degrees', { rotateTo: 370, expectedRotationAngle: 10 }],
    ['through negative', { rotateTo: -370, expectedRotationAngle: 350 }],
  ];

  it.each(rotateCases)(
    'should rotate %p',
    (_, { rotateTo, expectedRotationAngle }) => {
      arrange();

      performRotation(rotateTo);

      const func = updateElementsById.mock.calls[0][0].properties;
      expect(func(element1)).toStrictEqual({
        x: 0,
        y: 0,
        rotationAngle: expectedRotationAngle,
      });
      expect(func(element2)).toStrictEqual({
        x: 1,
        y: 1,
        rotationAngle: expectedRotationAngle,
      });
      expect(updateElementsById).toHaveBeenCalledTimes(1);
    }
  );
});
