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
import { memo } from '@web-stories-wp/react';
import { render, act } from '@testing-library/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import useStoryAnimationContext from '../useStoryAnimationContext';
import Provider from '../provider';
import WAAPIWrapper from '../WAAPIWrapper';

describe('StoryAnimation.WAAPIWrapper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders composed animations top down', () => {
    const useStoryAnimationContextMock = jest.spyOn(
      useStoryAnimationContext,
      'default'
    );

    const mock = (type) => {
      const MockComponent = ({ children }) => (
        <div data-testid={type}>{children}</div>
      );
      MockComponent.propTypes = {
        children: PropTypes.node.isRequired,
      };
      return MockComponent;
    };

    useStoryAnimationContextMock.mockImplementation(() => ({
      actions: {
        hoistWAAPIAnimation: () => () => {},
        getAnimationParts: () => [
          { WAAPIAnimation: mock('anim-1') },
          { WAAPIAnimation: mock('anim-2') },
          { WAAPIAnimation: mock('anim-3') },
        ],
      },
    }));

    const { container } = render(
      <Provider animations={[]}>
        <div data-testid="story-element-wrapper">
          <WAAPIWrapper target="_">
            <div data-testid="inner-content" />
          </WAAPIWrapper>
        </div>
      </Provider>
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        data-testid="story-element-wrapper"
      >
        <div
          data-testid="anim-1"
        >
          <div
            data-testid="anim-2"
          >
            <div
              data-testid="anim-3"
            >
              <div
                data-testid="inner-content"
              />
            </div>
          </div>
        </div>
      </div>
    `);

    useStoryAnimationContextMock.mockRestore();
  });

  describe('rerenders', () => {
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
    const MockElementInner = ({ renderMethod }) => {
      renderMethod();
      return null;
    };
    const MockElement = memo(({ target, renderMethod }) => {
      return (
        <WAAPIWrapper target={target}>
          <MockElementInner renderMethod={renderMethod} />
        </WAAPIWrapper>
      );
    });
    const ElementsWithWrapper = ({
      // eslint-disable-next-line react/prop-types
      animations,
      // eslint-disable-next-line react/prop-types
      elements,
      // eslint-disable-next-line react/prop-types
      elOneRenderMethod,
      // eslint-disable-next-line react/prop-types
      elTwoRenderMethod,
    }) => (
      <Provider animations={animations} elements={elements}>
        <div>
          <MockElement target="elOne" renderMethod={elOneRenderMethod} />
          <MockElement target="elTwo" renderMethod={elTwoRenderMethod} />
        </div>
      </Provider>
    );

    it('doesnt rerender wrappers uneffected by animation updates', () => {
      // Render with mock methods
      const elOneRenderMethod = jest.fn();
      const elTwoRenderMethod = jest.fn();
      const { rerender } = render(
        <ElementsWithWrapper
          animations={initialAnimations}
          elements={initialElements}
          elOneRenderMethod={elOneRenderMethod}
          elTwoRenderMethod={elTwoRenderMethod}
        />
      );

      // See that mock methods were called on mount
      expect(elOneRenderMethod).toHaveBeenCalledTimes(1);
      expect(elTwoRenderMethod).toHaveBeenCalledTimes(1);

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
            elOneRenderMethod={elOneRenderMethod}
            elTwoRenderMethod={elTwoRenderMethod}
          />
        );
      });

      // See that only the element effected by the animation update rerendered
      expect(elOneRenderMethod).toHaveBeenCalledTimes(2);
      expect(elTwoRenderMethod).toHaveBeenCalledTimes(1);
      expect(1).toBe(3);
    });
  });
});
