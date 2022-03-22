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
import { memo } from '@googleforcreators/react';
import { render, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Provider from '../provider';
import WAAPIWrapper from '../WAAPIWrapper';

describe('StoryAnimation.WAAPIWrapper', () => {
  describe('tracking necessary rerenders', () => {
    // Create mock data
    const createMockAnim = (partial) => ({
      id: 'animOne',
      targets: ['elOne'],
      delay: 0,
      duration: 350,
      iterations: 1,
      scale: 0.5,
      type: 'effect-pulse',
      ...partial,
    });
    const createMockElement = (partial) => ({
      id: '2e04154c-bc58-4969-bb4d-c69d32da0eac',
      flip: { vertical: false, horizontal: false },
      height: 1,
      isBackground: true,
      isDefaultBackground: true,
      lockAspectRatio: true,
      mask: { type: 'rectangle' },
      opacity: 100,
      rotationAngle: 0,
      type: 'shape',
      width: 1,
      x: 1,
      y: 1,
      ...partial,
    });
    const initialAnimations = [
      createMockAnim({ id: 'animOne', targets: ['elOne'] }),
      createMockAnim({ id: 'animTwo', targets: ['elTwo'] }),
    ];
    const initialElements = [
      createMockElement({ id: 'elOne' }),
      createMockElement({ id: 'elTwo' }),
    ];

    // Create React Mocks
    const MemoizedInner = memo(
      ({ ElOneWAAPIInvocationTracker, ElTwoWAAPIInvocationTracker }) => (
        <div>
          <ElOneWAAPIInvocationTracker target={'elOne'}>
            <div />
          </ElOneWAAPIInvocationTracker>
          <ElTwoWAAPIInvocationTracker target={'elTwo'}>
            <div />
          </ElTwoWAAPIInvocationTracker>
        </div>
      )
    );
    const ElementsWithWrapper = ({
      animations,

      elements,

      ElOneWAAPIInvocationTracker,

      ElTwoWAAPIInvocationTracker,
    }) => (
      <Provider animations={animations} elements={elements}>
        <MemoizedInner
          ElOneWAAPIInvocationTracker={ElOneWAAPIInvocationTracker}
          ElTwoWAAPIInvocationTracker={ElTwoWAAPIInvocationTracker}
        />
      </Provider>
    );

    it('doesnt rerender wrappers uneffected by animation updates', () => {
      // Render with mock methods
      const ElOneWAAPIInvocationTracker = jest.fn(WAAPIWrapper);
      const ElTwoWAAPIInvocationTracker = jest.fn(WAAPIWrapper);
      const { rerender } = render(
        <ElementsWithWrapper
          animations={initialAnimations}
          elements={initialElements}
          ElOneWAAPIInvocationTracker={ElOneWAAPIInvocationTracker}
          ElTwoWAAPIInvocationTracker={ElTwoWAAPIInvocationTracker}
        />
      );

      // See that mock methods were called on mount
      expect(ElOneWAAPIInvocationTracker).toHaveBeenCalledTimes(1);
      expect(ElTwoWAAPIInvocationTracker).toHaveBeenCalledTimes(1);

      // Update animations with one new animation and one
      // previous animation instance
      act(() => {
        rerender(
          <ElementsWithWrapper
            animations={[
              { ...initialAnimations[0], duration: 500 },
              initialAnimations[1],
            ]}
            elements={initialElements}
            ElOneWAAPIInvocationTracker={ElOneWAAPIInvocationTracker}
            ElTwoWAAPIInvocationTracker={ElTwoWAAPIInvocationTracker}
          />
        );
      });

      // See that only the element effected by the animation update rerendered
      // See that mock methods were called on mount
      //
      // @TODO https://github.com/GoogleForCreators/web-stories-wp/issues/10528
      // expect(ElOneWAAPIInvocationTracker).toHaveBeenCalledTimes(2);
      expect(ElTwoWAAPIInvocationTracker).toHaveBeenCalledTimes(1);
    });

    it('doesnt rerender wrappers uneffected by element updates', () => {
      // Render with mock methods
      const ElOneWAAPIInvocationTracker = jest.fn(WAAPIWrapper);
      const ElTwoWAAPIInvocationTracker = jest.fn(WAAPIWrapper);
      const { rerender } = render(
        <ElementsWithWrapper
          animations={initialAnimations}
          elements={initialElements}
          ElOneWAAPIInvocationTracker={ElOneWAAPIInvocationTracker}
          ElTwoWAAPIInvocationTracker={ElTwoWAAPIInvocationTracker}
        />
      );

      // See that mock methods were called on mount
      expect(ElOneWAAPIInvocationTracker).toHaveBeenCalledTimes(1);
      expect(ElTwoWAAPIInvocationTracker).toHaveBeenCalledTimes(1);

      // Update animations with one new animation and one
      // previous animation instance
      act(() => {
        rerender(
          <ElementsWithWrapper
            animations={initialAnimations}
            elements={[{ ...initialElements[0], x: 10 }, initialElements[1]]}
            ElOneWAAPIInvocationTracker={ElOneWAAPIInvocationTracker}
            ElTwoWAAPIInvocationTracker={ElTwoWAAPIInvocationTracker}
          />
        );
      });

      // See that only the element effected by the animation update rerendered
      // See that mock methods were called on mount
      //
      // @TODO https://github.com/GoogleForCreators/web-stories-wp/issues/10528
      // expect(ElOneWAAPIInvocationTracker).toHaveBeenCalledTimes(2);
      expect(ElTwoWAAPIInvocationTracker).toHaveBeenCalledTimes(1);
    });
  });
});
