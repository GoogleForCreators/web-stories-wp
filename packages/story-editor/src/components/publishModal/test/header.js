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
/**
 * Internal dependencies
 */
import { StoryContext } from '../../../app/story';
import renderWithTheme from '../../../testUtils/renderWithTheme';
import { CheckpointContext } from '../../checklist';
import Header from '../header';

// todo, comeback and add a few more tests here
// one for canPublish particularly.
describe('publishModal/header', () => {
  const mockOnClose = jest.fn();
  const mockOnPublish = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const view = () => {
    return renderWithTheme(
      <StoryContext.Provider
        value={{
          state: {
            story: {
              story: { status: 'draft' },
            },
            capabilities: { publish: true },
            meta: { isSaving: false },
          },
        }}
      >
        <CheckpointContext.Provider
          value={{
            state: {
              shouldReviewDialogBeSeen: true,
              checkpoint: 'all',
            },
          }}
        >
          <Header
            onClose={mockOnClose}
            onPublish={mockOnPublish}
            hasFutureDate={false}
          />
        </CheckpointContext.Provider>
      </StoryContext.Provider>
    );
  };

  it('should have no accessibility issues', async () => {
    const { container } = view();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should call onClose when close button is clicked', () => {
    view();

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onPublish when publish button is clicked', () => {
    view();

    const publishButton = screen.getByText('Publish');
    fireEvent.click(publishButton);

    expect(mockOnPublish).toHaveBeenCalledTimes(1);
  });
});
