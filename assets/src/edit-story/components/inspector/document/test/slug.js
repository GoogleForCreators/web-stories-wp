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
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../app/story/context';
import theme from '../../../../theme';
import SlugPanel from '../slug';

function setupPanel() {
  const updateStory = jest.fn();
  const deleteStory = jest.fn();

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
    actions: { updateStory, deleteStory },
  };
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <StoryContext.Provider value={storyContextValue}>
        <SlugPanel />
      </StoryContext.Provider>
    </ThemeProvider>
  );
  return {
    getByText,
    updateStory,
  };
}

describe('SlugPanel', () => {
  it('should render Slug Panel', () => {
    const { getByText } = setupPanel();
    const element = getByText('Permalink');
    expect(element).toBeDefined();
  });

  it('should display permalink', () => {
    const { getByText } = setupPanel();
    expect(getByText('https://example.com/foo')).toBeDefined();
  });
});
