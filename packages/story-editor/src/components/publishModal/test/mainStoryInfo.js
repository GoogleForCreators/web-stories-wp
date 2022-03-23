/*
 * Copyright 2022 Google LLC
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
import { axe } from 'jest-axe';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StoryContext from '../../../app/story/context';
import { ChecklistCountProvider } from '../../checklist';
import SidebarContext from '../../sidebar/context';
import { INPUT_KEYS } from '../constants';
import MainStoryInfo from '../content/mainStoryInfo';

const mockInputValues = {
  [INPUT_KEYS.EXCERPT]:
    'A voyage to the great beyond, where none have gone and going back is impossible.',
  [INPUT_KEYS.TITLE]: "David Bowman's Odyssey",
  [INPUT_KEYS.SLUG]: '2001-space-odyssey',
};

describe('publishModal/mainStoryInfo', () => {
  const mockHandleUpdateStory = jest.fn();
  afterEach(() => {
    jest.clearAllMocks();
  });

  const sidebarContextValue = {
    actions: { loadUsers: jest.fn() },
    state: {
      users: [{ value: 'foo' }, { value: 'bar' }],
    },
    data: {
      modalSidebarTab: {
        DocumentPane: null,
      },
    },
  };

  const view = () => {
    return renderWithTheme(
      <StoryContext.Provider
        value={{
          actions: { updateStory: mockHandleUpdateStory },
          state: {
            story: {
              ...mockInputValues,
            },
          },
        }}
      >
        <SidebarContext.Provider value={sidebarContextValue}>
          <ChecklistCountProvider hasChecklist>
            <MainStoryInfo />
          </ChecklistCountProvider>
        </SidebarContext.Provider>
      </StoryContext.Provider>
    );
  };
  it('should have no accessibility issues', async () => {
    const { container } = view();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should trigger mockHandleUpdateStory on title input blur', () => {
    view();

    const titleInput = screen.getByRole('textbox', { name: 'Story Title' });

    fireEvent.change(titleInput, {
      target: { value: "David Bowman (and HAL's) Odyseey" },
    });

    fireEvent.blur(titleInput);

    expect(mockHandleUpdateStory).toHaveBeenCalledTimes(1);
  });

  it('should trigger mockHandleUpdateStory on excerpt input change', () => {
    view();

    const descriptionInput = screen.getByRole('textbox', {
      name: 'Story Description',
    });

    fireEvent.change(descriptionInput, {
      target: { value: 'Lorem ipsum' },
    });

    fireEvent.blur(descriptionInput);

    expect(mockHandleUpdateStory).toHaveBeenCalledTimes(1);
  });
});
