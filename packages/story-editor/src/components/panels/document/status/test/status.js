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
  },
  password = ''
) {
  const updateStory = jest.fn();

  const storyContextValue = {
    state: {
      story: { status: 'draft', password },
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

describe('statusPanel', () => {
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
      name: 'Visibility',
    });
    expect(element).toBeInTheDocument();

    const radioOptions = screen.getAllByRole('radio');
    expect(radioOptions).toHaveLength(4);
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

  it('should display password field', () => {
    arrange(
      {
        publish: true,
      },
      'test'
    );
    expect(screen.queryByLabelText('Password')).toBeInTheDocument();
  });

  it('should hide password field on change status', () => {
    const { updateStory } = arrange(
      {
        publish: true,
      },
      'test'
    );
    expect(screen.queryByLabelText('Password')).toBeInTheDocument();
    const publishOption = screen.getByText('Public');
    fireEvent.click(publishOption);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'publish',
        password: '',
      },
    });
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  });

  it('should update password field on blur', () => {
    const { updateStory } = arrange(
      {
        publish: false,
      },
      'test'
    );
    const passwordInput = screen.queryByLabelText('Password');
    expect(passwordInput).toBeInTheDocument();
    fireEvent.blur(passwordInput);
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        password: 'test',
      },
    });
  });
});
