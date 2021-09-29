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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../../app/story/context';
import { renderWithTheme } from '../../../../../testUtils';
import StatusPanel from '../status';

function arrange(
  capabilities = {
    publish: true,
  }
) {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: { status: 'draft', password: '' },
      capabilities,
    },
    actions: { updateStory },
  };
  const view = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <StatusPanel />
    </StoryContext.Provider>
  );
  return {
    ...view,
    updateStory,
  };
}

describe('StatusPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:status',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render Status Panel', () => {
    arrange();
    const element = screen.getByRole('button', {
      name: 'Status and visibility',
    });
    expect(element).toBeInTheDocument();

    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).toHaveLength(3);
  });

  it('should not render the status option without correct permissions', () => {
    arrange({
      publish: false,
    });
    expect(screen.queryByText('Public')).not.toBeInTheDocument();
  });

  it('should update the story when clicking on status', () => {
    const { updateStory } = arrange();
    const publishOption = screen.getByText('Public');
    fireEvent.click(publishOption);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'publish',
        password: '',
      },
    });
  });
});
