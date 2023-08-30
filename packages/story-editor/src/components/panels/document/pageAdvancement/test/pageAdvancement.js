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
import PageAdvancementPanel from '../pageAdvancement';

function arrange(configs = {}) {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        autoAdvance: false,
        defaultPageDuration: 7,
        ...configs,
      },
    },
    actions: { updateStory },
  };

  renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <PageAdvancementPanel />
    </StoryContext.Provider>
  );

  return {
    updateStory,
  };
}

describe('PageAdvancementPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:pageAdvancement',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render Page Advancement Panel with default settings if undefined in story', () => {
    arrange({ autoAdvance: undefined, defaultPageDuration: undefined });
    const durationInput = screen.getByLabelText(
      'Default page duration in seconds'
    );
    expect(durationInput).toHaveValue('7 seconds');
  });

  it('should render Page Advancement Panel', () => {
    const { updateStory } = arrange();
    const element = screen.getByRole('button', { name: 'Page Advancement' });
    expect(element).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Auto' }));
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        autoAdvance: true,
      },
    });
  });

  it('should set Page Duration', async () => {
    const { updateStory } = arrange({
      autoAdvance: true,
    });
    const element = screen.getByRole('button', { name: 'Page Advancement' });
    expect(element).toBeInTheDocument();

    const input = screen.getByRole('textbox', {
      name: 'Default page duration in seconds',
    });

    fireEvent.change(input, {
      target: { value: '0' },
    });
    fireEvent.blur(input);

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          defaultPageDuration: 1,
        },
      })
    );

    expect(updateStory).toHaveBeenCalledOnce();

    fireEvent.change(input, {
      // Note: With PR#13339, if value exceeds max, it will remove leading character to get value into the valid range.
      target: { value: '21' },
    });
    fireEvent.blur(input);

    await waitFor(() =>
      expect(updateStory).toHaveBeenCalledWith({
        properties: {
          defaultPageDuration: 1,
        },
      })
    );
  });
});
