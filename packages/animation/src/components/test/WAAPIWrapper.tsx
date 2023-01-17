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
import { render, act } from '@testing-library/react';
import { useMemo } from '@googleforcreators/react';
import type { FunctionComponent } from 'react';

/**
 * Internal dependencies
 */
import { AnimationType, Element, ElementId, StoryAnimation } from '../../types';
import Provider from '../provider';
import WAAPIWrapper from '../WAAPIWrapper';

type Tracker = FunctionComponent<{ target: string }>;
type TrackersProps = {
  ElOneWAAPIInvocationTracker: Tracker;
  ElTwoWAAPIInvocationTracker: Tracker;
};
type ElementsWithWrapperProps = {
  animations: StoryAnimation[];
  elements: Element[];
  ElOneWAAPIInvocationTracker: Tracker;
  ElTwoWAAPIInvocationTracker: Tracker;
};
function Trackers({
  ElOneWAAPIInvocationTracker,
  ElTwoWAAPIInvocationTracker,
}: TrackersProps) {
  return useMemo(
    () => (
      <div>
        <ElOneWAAPIInvocationTracker target={'elOne'}>
          <div />
        </ElOneWAAPIInvocationTracker>
        <ElTwoWAAPIInvocationTracker target={'elTwo'}>
          <div />
        </ElTwoWAAPIInvocationTracker>
      </div>
    ),
    [ElOneWAAPIInvocationTracker, ElTwoWAAPIInvocationTracker]
  );
}

describe('StoryAnimation.WAAPIWrapper', () => {
  describe('tracking necessary rerenders', () => {
    // Create mock data
    const createMockAnim = (
      id: string,
      targets: ElementId[]
    ): StoryAnimation => ({
      type: AnimationType.EffectPulse,
      delay: 0,
      duration: 350,
      iterations: 1,
      scale: 0.5,
      id,
      targets,
    });
    const createMockElement = (partial: Partial<Element>): Element => ({
      id: '2e04154c-bc58-4969-bb4d-c69d32da0eac',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotationAngle: 0,
      ...partial,
    });
    const initialAnimations = [
      createMockAnim('animOne', ['elOne']),
      createMockAnim('animTwo', ['elTwo']),
    ];
    const initialElements = [
      createMockElement({ id: 'elOne' }),
      createMockElement({ id: 'elTwo' }),
    ];

    const ElementsWithWrapper = ({
      animations,
      elements,
      ElOneWAAPIInvocationTracker,
      ElTwoWAAPIInvocationTracker,
    }: ElementsWithWrapperProps) => (
      <Provider animations={animations} elements={elements}>
        <Trackers
          ElOneWAAPIInvocationTracker={ElOneWAAPIInvocationTracker}
          ElTwoWAAPIInvocationTracker={ElTwoWAAPIInvocationTracker}
        />
      </Provider>
    );

    it('doesnt rerender wrappers uneffected by animation updates', async () => {
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
      await act(() => {
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
      expect(ElOneWAAPIInvocationTracker).toHaveBeenCalledTimes(2);
      expect(ElTwoWAAPIInvocationTracker).toHaveBeenCalledTimes(1);
    });

    it('doesnt rerender wrappers uneffected by element updates', async () => {
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

      // Update animations with one new element and one
      // previous element instance
      await act(() => {
        rerender(
          <ElementsWithWrapper
            animations={initialAnimations}
            elements={[{ ...initialElements[0] }, initialElements[1]]}
            ElOneWAAPIInvocationTracker={ElOneWAAPIInvocationTracker}
            ElTwoWAAPIInvocationTracker={ElTwoWAAPIInvocationTracker}
          />
        );
      });

      // See that only the element effected by the animation update rerendered
      expect(ElOneWAAPIInvocationTracker).toHaveBeenCalledTimes(2);
      expect(ElTwoWAAPIInvocationTracker).toHaveBeenCalledTimes(1);
    });
  });
});
