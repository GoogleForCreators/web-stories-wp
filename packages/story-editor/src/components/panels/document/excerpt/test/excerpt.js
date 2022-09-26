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
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../../app/story/context';
import ExcerptPanel, { EXCERPT_MAX_LENGTH } from '../excerpt';

function arrange() {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        excerpt: 'This is the story excerpt.',
      },
    },
    actions: { updateStory },
  };

  return renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <ExcerptPanel />
    </StoryContext.Provider>
  );
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
    arrange();
    const element = screen.getByRole('button', { name: 'Story Description' });
    expect(element).toBeInTheDocument();
  });

  it('should display textbox', () => {
    arrange();
    const input = screen.getByRole('textbox', { name: 'Story Description' });
    expect(input).toBeInTheDocument();
  });

  it('should respect excerpt character limit', () => {
    arrange();
    const input = screen.getByRole('textbox', { name: 'Story Description' });

    expect(input.maxLength).toBe(EXCERPT_MAX_LENGTH);
  });
});
