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
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import SlugPanel from '../slug';
import { renderWithTheme } from '../../../../testUtils';

function setupPanel() {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        slug: 'foo',
        link: 'https://example.com',
        permalinkConfig: {
          prefix: 'https://example.com/',
          suffix: '',
        },
      },
    },
    actions: { updateStory },
  };
  const { getByRole } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <SlugPanel />
    </StoryContext.Provider>
  );
  return {
    getByRole,
    updateStory,
  };
}

describe('SlugPanel', () => {
  it('should render Slug Panel', () => {
    const { getByRole } = setupPanel();
    const element = getByRole('button', { name: 'Permalink' });
    expect(element).toBeDefined();
  });

  it('should display permalink', () => {
    const { getByRole } = setupPanel();
    const url = getByRole('link', { name: 'https://example.com/foo' });
    expect(url).toBeDefined();
  });
});
