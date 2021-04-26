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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import StoryContext from '../../../../../app/story/context';
import ConfigContext from '../../../../../app/config/context';
import { renderWithTheme } from '../../../../../testUtils';
import StatusPanel from '../status';
import { StoryTriggersProvider } from '../../../../../app/story/storyTriggers';

function setupPanel(
  capabilities = {
    hasPublishAction: true,
  }
) {
  const updateStory = jest.fn();

  const config = { capabilities };
  const storyContextValue = {
    state: {
      story: { status: 'draft', password: '' },
    },
    actions: { updateStory },
  };
  const result = renderWithTheme(
    <StoryTriggersProvider>
      <ConfigContext.Provider value={config}>
        <StoryContext.Provider value={storyContextValue}>
          <StatusPanel />
        </StoryContext.Provider>
      </ConfigContext.Provider>
    </StoryTriggersProvider>
  );
  return {
    ...result,
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
    const { getByRole, getAllByRole } = setupPanel();
    const element = getByRole('button', { name: 'Status and visibility' });
    expect(element).toBeInTheDocument();

    const radioOptions = getAllByRole('radio');
    expect(radioOptions).toHaveLength(3);
  });

  it('should not render the status option without correct permissions', () => {
    const { queryByText } = setupPanel({
      hasPublishAction: false,
    });
    expect(queryByText('Public')).not.toBeInTheDocument();
  });

  it('should update the story when clicking on status', () => {
    const { getByText, updateStory } = setupPanel();
    const publishOption = getByText('Public');
    fireEvent.click(publishOption);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'publish',
        password: '',
      },
    });
  });
});
