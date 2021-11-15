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
import { StoryContext } from '@web-stories-wp/story-editor';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../../testUtils';
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
      story: {
        status: 'draft',
        password,
        title: '',
        storyId: 123,
        editLink: 'http://localhost/wp-admin/post.php?post=123&action=edit',
      },
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

const windowConfirm = jest.fn(() => true);

describe('statusPanel', () => {
  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:status',
      JSON.stringify({ isCollapsed: false })
    );

    // Mock window.confirm()
    Object.defineProperty(window, 'confirm', {
      writable: true,
      value: windowConfirm,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(radioOptions).toHaveLength(3);
    expect(screen.getByLabelText('Public')).toBeInTheDocument();
    expect(screen.getByLabelText('Private')).toBeInTheDocument();
    expect(screen.getByLabelText('Password Protected')).toBeInTheDocument();
  });

  it('should always render the "Public" visibility option', () => {
    arrange({
      publish: false,
    });
    expect(screen.getByLabelText('Public')).toBeInTheDocument();
  });

  it('should not render other visibility options if lacking permissions', () => {
    arrange({
      publish: false,
    });
    expect(screen.queryByLabelText('Private')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Password Protected')
    ).not.toBeInTheDocument();
  });

  it('should update the status when marking a story private', () => {
    const { updateStory } = arrange();
    fireEvent.click(screen.getByLabelText('Private'));
    expect(windowConfirm).toHaveBeenCalledWith(expect.any(String));
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'private',
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

  it('should hide password field when changing visibility', () => {
    const { updateStory } = arrange(
      {
        publish: true,
      },
      'test'
    );
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Public'));
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'draft',
        password: '',
      },
    });
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  });
});
