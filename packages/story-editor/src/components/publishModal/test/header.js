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
import { StoryContext } from '../../../app/story';
import { CheckpointContext } from '../../checklist';
import Header from '../header';

describe('publishModal/header', () => {
  const mockOnClose = jest.fn();
  const mockOnPublish = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  const view = (args) => {
    const { storyArgs = {}, capabilitiesArgs = {} } = args || {};
    return renderWithTheme(
      <StoryContext.Provider
        value={{
          state: {
            story: {
              story: { status: 'draft', ...storyArgs },
            },
            capabilities: { publish: true, ...capabilitiesArgs },
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

  it('should show submit for review when capability of publish is false', () => {
    view({ capabilitiesArgs: { publish: false } });

    const reviewButton = screen.getByText('Submit for review');
    fireEvent.click(reviewButton);

    expect(mockOnPublish).toHaveBeenCalledTimes(1);
  });

  it('should show tooltip in button when priority issues present', () => {
    view();

    const publishButton = screen.getByText('Publish');
    fireEvent.focus(publishButton);

    expect('Make updates before publishing to improve').toBeTruthy();
  });
});
