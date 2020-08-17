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
jest.mock('flagged');
import { render } from '@testing-library/react';
import { useFeature } from 'flagged';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import * as useStoryAnimationContext from '../useStoryAnimationContext';
import Provider from '../provider';
import WAAPIWrapper from '../WAAPIWrapper';

describe('StoryAnimation.WAAPIWrapper', () => {
  useFeature.mockImplementation(() => true);

  it('renders composed animations top down', () => {
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
});
