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
import InspectorContext from '../../../inspector/context';
import StatusPanel from '../status';
import { renderWithTheme } from '../../../../testUtils';

function setupPanel(
  capabilities = {
    hasPublishAction: true,
  }
) {
  const updateStory = jest.fn();
  const deleteStory = jest.fn();
  const loadStatuses = jest.fn();
  const loadUsers = jest.fn();

  const storyContextValue = {
    state: {
      story: { status: 'draft', password: '' },
      capabilities,
    },
    actions: { updateStory, deleteStory },
  };
  const statuses = [
    {
      value: 'draft',
      name: 'Draft',
    },
    {
      value: 'publish',
      name: 'Public',
    },
    {
      value: 'private',
      name: 'Private',
    },
  ];
  const inspectorContextValue = {
    actions: { loadStatuses, loadUsers },
    state: { statuses },
  };
  const { getByText, queryByText } = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <InspectorContext.Provider value={inspectorContextValue}>
        <StatusPanel />
      </InspectorContext.Provider>
    </StoryContext.Provider>
  );
  return {
    getByText,
    queryByText,
    updateStory,
    deleteStory,
  };
}

describe('StatusPanel', () => {
  it('should render Status Panel', () => {
    const { getByText } = setupPanel();
    const element = getByText('Status & Visibility');
    expect(element).toBeDefined();

    const radioOption = getByText('Draft');
    expect(radioOption).toBeDefined();
  });

  it('should not render the status option without correct permissions', () => {
    const { queryByText } = setupPanel({
      hasPublishAction: false,
    });
    expect(queryByText('Draft')).toBeNull();
  });

  it('should update the story when clicking on status', () => {
    const { getByText, updateStory } = setupPanel();
    const publishOption = getByText(/Public/i).closest('label');
    fireEvent.click(publishOption);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'publish',
        password: '',
      },
    });
  });

  it('should trigger deleting the story when clicking on delete button', () => {
    const { deleteStory, queryByText } = setupPanel();

    const deleteButton = queryByText('Move to trash');
    expect(deleteButton).toBeDefined();

    fireEvent.click(deleteButton);
    expect(deleteStory).toHaveBeenCalledTimes(1);
  });
});
