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
import { fireEvent, waitFor, screen } from '@testing-library/react';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../../app/story/context';
import SlugPanel, { MIN_MAX } from '../slug';

function arrange(storyConfig = {}) {
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
        ...storyConfig,
      },
    },
    actions: { updateStory },
  };
  renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <SlugPanel />
    </StoryContext.Provider>
  );
  return {
    updateStory,
  };
}

describe('SlugPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:permalink',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render Slug Panel', () => {
    arrange();
    const element = screen.getByRole('button', { name: 'Permalink' });
    expect(element).toBeInTheDocument();
  });

  it('should display permalink', () => {
    arrange();
    const url = screen.getByRole('link', { name: 'https://example.com/foo' });
    expect(url).toBeInTheDocument();
  });

  it('should not display the input when using non-pretty permalinks', () => {
    arrange({ permalinkConfig: null });
    expect(() => screen.getByRole('textbox', { name: 'URL slug' })).toThrow(
      'Unable to find an accessible element with the role "textbox" and name "URL slug"'
    );
  });

  it('should not allow trailing spaces while typing and onblur', async () => {
    const { updateStory } = arrange();
    const input = screen.getByRole('textbox', { name: 'URL slug' });

    fireEvent.change(input, {
      target: { value: 'name with spaces ' },
    });

    expect(input).toHaveValue('name-with-spaces-');

    fireEvent.blur(input, {
      target: { value: 'different name with spaces ' },
    });

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          slug: 'different-name-with-spaces',
        },
      })
    );
  });

  it('should respect the link limit', async () => {
    const { updateStory } = arrange();
    const input = screen.getByRole('textbox', { name: 'URL slug' });
    expect(input).toBeInTheDocument();

    const bigSlug = ''.padStart(MIN_MAX.PERMALINK.MAX + 10, '1');

    fireEvent.blur(input, {
      target: { value: bigSlug },
    });

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          // It will return only 200 even receiving 201+
          slug: bigSlug.slice(0, MIN_MAX.PERMALINK.MAX),
        },
      })
    );

    fireEvent.blur(input, {
      target: { value: '1234' },
    });

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          slug: '1234',
        },
      })
    );
  });
});
