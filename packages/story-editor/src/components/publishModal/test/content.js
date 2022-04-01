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
import { ConfigContext } from '../../../app/config';
import StoryContext from '../../../app/story/context';
import { noop } from '../../../utils/noop';
import { ChecklistCountProvider } from '../../checklist';
import SidebarContext from '../../sidebar/context';
import { INPUT_KEYS } from '../constants';
import Content from '../content';

const mockInputValues = {
  [INPUT_KEYS.EXCERPT]:
    'A voyage to the great beyond, where none have gone and going back is impossible.',
  [INPUT_KEYS.TITLE]: "David Bowman's Odyssey",
  [INPUT_KEYS.SLUG]: '2001-space-odyssey',
};

describe('publishModal/content', () => {
  const mockHandleReviewChecklist = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const configContextValue = {
    allowedMimeTypes: { image: [] },
    metadata: {
      publisher: '',
    },
    capabilities: {
      hasUploadMediaAction: true,
    },
    MediaUpload: () => <button onClick={noop}>{'Media Upload Button!'}</button>,
  };

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
      <ConfigContext.Provider value={configContextValue}>
        <StoryContext.Provider
          value={{
            actions: { updateStory: jest.fn() },
            state: {
              story: {
                ...mockInputValues,
              },
            },
          }}
        >
          <SidebarContext.Provider value={sidebarContextValue}>
            <ChecklistCountProvider hasChecklist>
              <Content handleReviewChecklist={mockHandleReviewChecklist} />
            </ChecklistCountProvider>
          </SidebarContext.Provider>
        </StoryContext.Provider>
      </ConfigContext.Provider>
    );
  };
  it('should have no accessibility issues', async () => {
    const { container } = view();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should trigger handleReviewChecklist on checklist button click', () => {
    view();

    const checklistButton = screen.getByRole('button', { name: 'Checklist' });

    fireEvent.click(checklistButton);

    expect(mockHandleReviewChecklist).toHaveBeenCalledTimes(1);
  });
});
