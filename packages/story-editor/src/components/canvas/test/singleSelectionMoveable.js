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
import { render, act, waitFor } from '@testing-library/react';
import { withOverlay } from '@googleforcreators/moveable';
import { MockMoveable } from 'react-moveable'; // eslint-disable-line import/named -- This is a custom Jest mock
import PropTypes from 'prop-types';
import { forwardRef } from '@googleforcreators/react';
import { UnitsProvider } from '@googleforcreators/units';
import { TransformProvider } from '@googleforcreators/transform';
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import CanvasContext from '../../../app/canvas/context';
import Selection from '../selection';
import StoryContext from '../../../app/story/context';

const pageSize = { width: 100, height: 100 };

const element = {
  id: '1',
  type: 'text',
};

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

describe('singleSelectionMoveable', () => {
  let updateSelectedElements;
  let target;
  let storyContext;
  let canvasContext;

  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  beforeEach(() => {
    updateSelectedElements = jest.fn();
    target = document.createElement('div');

    storyContext = {
      state: {
        selectedElements: [element],
        currentPage: {
          elements: [],
        },
      },
      actions: { updateSelectedElements },
    };
    canvasContext = {
      state: {
        pageSize,
        nodesById: { 1: target },
        fullbleedContainer: document.body,
      },
      actions: {
        setDisplayLinkGuidelines: jest.fn(),
      },
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
    const moveable =
      MockMoveable.mock.calls[MockMoveable.mock.calls.length - 1][0];
    moveable?.onRotateStart({ set: () => {} });
    moveable?.onRotate({
      target,
      beforeRotate: rotateTo,
    });
    moveable?.onRotateEnd({ target });
  }

  const rotateCases = [
    ['normally', { rotateTo: 45, expectedRotationAngle: 45 }],
    ['through 360 degrees', { rotateTo: 370, expectedRotationAngle: 10 }],
    ['through negative', { rotateTo: -370, expectedRotationAngle: 350 }],
  ];

  it.each(rotateCases)(
    'should rotate %p',
    async (_, { rotateTo, expectedRotationAngle }) => {
      arrange();
      // Wait until the component has loaded.
      await waitFor(
        () => MockMoveable.mock.calls[MockMoveable.mock.calls.length - 1][0]
      );
      act(() => {
        performRotation(rotateTo);
      });

      expect(updateSelectedElements).toHaveBeenLastCalledWith({
        properties: { rotationAngle: expectedRotationAngle },
      });
    }
  );
});
