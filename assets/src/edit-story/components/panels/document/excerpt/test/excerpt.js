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
import { fireEvent, waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../../app/story/context';
import { renderWithTheme } from '../../../../../testUtils';
import ExcerptPanel, { EXCERPT_MAX_LENGTH } from '../excerpt';

function setupPanel() {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        excerpt: 'This is the story excerpt.',
      },
    },
    actions: { updateStory },
  };

  const { getByRole } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <ExcerptPanel />
    </StoryContext.Provider>
  );

  return {
    getByRole,
    updateStory,
  };
}

describe('ExcerptPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:excerpt',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render Excerpt Panel', () => {
    const { getByRole } = setupPanel();
    const element = getByRole('button', { name: 'Story Description' });
    expect(element).toBeInTheDocument();
  });

  it('should display textbox', () => {
    const { getByRole } = setupPanel();
    const input = getByRole('textbox', { name: 'Story Description' });
    expect(input).toBeInTheDocument();
  });

  it('should respect excerpt character limit', async () => {
    const { getByRole, updateStory } = setupPanel();
    const input = getByRole('textbox', { name: 'Story Description' });

    const bigExcerpt = ''.padStart(EXCERPT_MAX_LENGTH + 10, '1');

    fireEvent.change(input, {
      target: { value: bigExcerpt },
    });

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          excerpt: bigExcerpt.slice(0, EXCERPT_MAX_LENGTH),
        },
      })
    );

    fireEvent.change(input, {
      target: { value: 'This is the excerpt.' },
    });

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          excerpt: 'This is the excerpt.',
        },
      })
    );
  });
});
