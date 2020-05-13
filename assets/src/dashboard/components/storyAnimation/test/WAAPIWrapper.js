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
jest.mock('..');
jest.mock('../../../animations/animationParts');
/**
 * External dependencies
 */
import { render, within } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { WAAPI } from '../../../animations/animationParts';
import { useStoryAnimationContext } from '..';
const { default: StoryAnimations } = jest.requireActual('..');

WAAPI.mockImplementation((type) => ({ children }) => (
  <div data-testid={type}>{children}</div>
));

const types = ['anim-1', 'anim-2', 'anim-3'];

useStoryAnimationContext.mockReturnValue({
  state: {
    getAnimationGenerators: () => types.map((type) => (fn) => fn(type, {})),
  },
  actions: {
    hoistWAAPIAnimation: () => () => {},
  },
});

describe('StoryAnimations.WAAPIWrapper', () => {
  it('renders ascending generated animations top down', () => {
    const { getByTestId } = render(
      <StoryAnimations.Provider animations={[]}>
        <StoryAnimations.WAAPIWrapper target="_">
          <div />
        </StoryAnimations.WAAPIWrapper>
      </StoryAnimations.Provider>
    );

    for (let i = 0; i < types.length; i++) {
      const parent = getByTestId(types[i]);
      for (let j = 0; j < types.length; j++) {
        expect(within(parent).getAllByTestId(types[j])).toHaveLength(
          i > j ? 0 : 1
        );
      }
    }
  });
});
