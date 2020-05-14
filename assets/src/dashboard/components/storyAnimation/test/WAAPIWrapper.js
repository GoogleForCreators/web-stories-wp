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
/**
 * Internal dependencies
 */
import * as animationParts from '../../../animations/animationParts';
import * as useStoryAnimationContext from '../useStoryAnimationContext';
import StoryAnimation from '..';

describe('StoryAnimation.WAAPIWrapper', () => {
  it('renders composed animations top down', () => {
    const WAAPIMock = jest.spyOn(animationParts, 'WAAPI');
    const useStoryAnimationContextMock = jest.spyOn(
      useStoryAnimationContext,
      'default'
    );
    WAAPIMock.mockImplementation((type) => ({ children }) => (
      <div data-testid={type}>{children}</div>
    ));
    useStoryAnimationContextMock.mockReturnValue({
      state: {
        getAnimationGenerators: () => [
          (fn) => fn('anim-1', {}),
          (fn) => fn('anim-2', {}),
          (fn) => fn('anim-3', {}),
        ],
      },
      actions: {
        hoistWAAPIAnimation: () => () => {},
      },
    });

    const { container } = render(
      <StoryAnimation.Provider animations={[]}>
        <div data-testid="story-element-wrapper">
          <StoryAnimation.WAAPIWrapper target="_">
            <div data-testid="inner-content" />
          </StoryAnimation.WAAPIWrapper>
        </div>
      </StoryAnimation.Provider>
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

    WAAPIMock.mockRestore();
    useStoryAnimationContextMock.mockRestore();
  });
});
