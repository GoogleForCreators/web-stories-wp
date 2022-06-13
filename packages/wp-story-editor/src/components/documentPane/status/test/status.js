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
import { StoryContext } from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StatusPanel from '../status';
import { STATUS, VISIBILITY } from '../../../../constants';

function arrange(
  capabilities = {
    publish: true,
  },
  password = '',
  visibility = VISIBILITY.PUBLIC
) {
  const updateStory = jest.fn();
  const saveStory = jest.fn();

  const storyContextValue = {
    state: {
      story: {
        status: STATUS.DRAFT,
        password,
        title: '',
        storyId: 123,
        editLink: 'http://localhost/wp-admin/post.php?post=123&action=edit',
        visibility,
      },
      capabilities,
    },
    actions: { updateStory, saveStory },
  };
  const view = renderWithTheme(
    <StoryContext.Provider value={storyContextValue}>
      <StatusPanel />
    </StoryContext.Provider>
  );
  return {
    ...view,
    updateStory,
    saveStory,
  };
}

const windowConfirm = jest.fn(() => true);

const clickDropdown = () => {
  const dropdownBtn = screen.getByRole('button', {
    name: 'Public',
  });
  fireEvent.click(dropdownBtn);
};

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
    clickDropdown();

    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(
      screen.getByRole('option', {
        name: 'Public Visible to everyone',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: 'Private Visible to site admins & editors only',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', {
        name: 'Password Protected Visible only to those with the password.',
      })
    ).toBeInTheDocument();
  });

  it('should always render the "Public" visibility option', () => {
    arrange({
      publish: false,
    });
    clickDropdown();

    expect(
      screen.getByRole('button', {
        name: 'Public',
      })
    ).toBeInTheDocument();
  });

  it('should not render other visibility options if lacking permissions', () => {
    arrange({
      publish: false,
    });
    clickDropdown();

    expect(
      screen.queryByRole('option', {
        name: 'Private Visible to site admins & editors only',
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('option', {
        name: 'Password Protected Visible only to those with the password.',
      })
    ).not.toBeInTheDocument();
  });

  it('should update the status when marking a story private', () => {
    const { saveStory } = arrange();
    clickDropdown();

    fireEvent.click(
      screen.getByRole('option', {
        name: 'Private Visible to site admins & editors only',
      })
    );
    expect(windowConfirm).toHaveBeenCalledWith(expect.any(String));
    expect(saveStory).toHaveBeenCalledWith({
      status: STATUS.PRIVATE,
      password: '',
    });
  });

  it('should display password field', () => {
    arrange(
      {
        publish: true,
      },
      'password',
      'protected'
    );

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should update properties changing visibility', () => {
    const { updateStory } = arrange(
      {
        publish: true,
      },
      'password',
      VISIBILITY.PASSWORD_PROTECTED
    );
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    const dropdownBtn = screen.getByRole('button', {
      name: 'Password Protected',
    });
    fireEvent.click(dropdownBtn);

    fireEvent.click(
      screen.getByRole('option', {
        name: 'Public Visible to everyone',
      })
    );
    expect(updateStory).toHaveBeenCalledWith({
      properties: {
        status: 'draft',
        password: '',
      },
    });
  });
  it('should hide password when public visibility', () => {
    arrange(
      {
        publish: true,
      },
      undefined,
      VISIBILITY.PUBLIC
    );
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  });
});
