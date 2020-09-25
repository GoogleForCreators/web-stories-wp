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
import StoryContext from '../../../../app/story/context';
import ConfigContext from '../../../../app/config/context';
import StatusPanel from '../status';
import { renderWithTheme } from '../../../../testUtils';

function setupPanel(
  capabilities = {
    hasPublishAction: true,
  }
) {
  const updateStory = jest.fn();

  const config = { locale: { timeFormat: 'g:i a' }, capabilities };
  const storyContextValue = {
    state: {
      story: { status: 'draft', password: '' },
    },
    actions: { updateStory },
  };
  const { getByRole, queryByText } = renderWithTheme(
    <ConfigContext.Provider value={config}>
      <StoryContext.Provider value={storyContextValue}>
        <StatusPanel />
      </StoryContext.Provider>
    </ConfigContext.Provider>
  );
  return {
    getByRole,
    queryByText,
    updateStory,
  };
}

describe('StatusPanel', () => {
  it('should render Status Panel', () => {
    const { getByRole } = setupPanel();
    const element = getByRole('button', { name: 'Status & Visibility' });
    expect(element).toBeDefined();

    const radioOption = getByRole('radio', { name: 'Draft' });
    expect(radioOption).toBeDefined();
  });

  it('should not render the status option without correct permissions', () => {
    const { queryByText } = setupPanel({
      hasPublishAction: false,
    });
    expect(queryByText('Public')).toBeNull();
  });

  it('should update the story when clicking on status', () => {
    const { getByRole, updateStory } = setupPanel();
    const publishOption = getByRole('radio', { name: /Public/i }).closest(
      'label'
    );
    fireEvent.click(publishOption);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'publish',
        password: '',
      },
    });
  });
});
