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
import { renderWithThemeAndFlagsProvider } from '../../../../testUtils';
import completeTemplateObject from '../../../../dataUtils/completeTemplateObject';
import { ApiContext } from '../../../api/apiProvider';
import PreviewStory from '../';

describe('Preview Story within Dashboard', function () {
  const onClose = jest.fn();
  it('should render a modal, button, and iframe for preview', function () {
    const { getByRole, getByTestId } = renderWithThemeAndFlagsProvider(
      <ApiContext.Provider
        value={{
          state: {
            stories: {
              error: {},
              isLoading: false,
              previewMarkup: '<p>some fake markup to trigger the iframe</p>',
            },
          },
          actions: {
            storyApi: {
              createStoryPreviewFromTemplate: jest.fn(),
              clearStoryPreview: jest.fn(),
            },
          },
        }}
      >
        <PreviewStory
          story={completeTemplateObject}
          isTemplate
          handleClose={onClose}
        />
      </ApiContext.Provider>
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByTestId('preview-iframe')).toBeInTheDocument();

    fireEvent.click(getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render a modal, button, iframe, and loading message when error and previewMarkup are not present and isLoading is true', function () {
    const {
      getByRole,
      getByTestId,
      getByText,
    } = renderWithThemeAndFlagsProvider(
      <ApiContext.Provider
        value={{
          state: {
            stories: {
              error: {},
              isLoading: true,
              previewMarkup: '',
            },
          },
          actions: {
            storyApi: {
              createStoryPreviewFromTemplate: jest.fn(),
              clearStoryPreview: jest.fn(),
            },
          },
        }}
      >
        <PreviewStory
          story={completeTemplateObject}
          isTemplate
          handleClose={onClose}
        />
      </ApiContext.Provider>
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(getByRole('button')).toBeInTheDocument();
    expect(getByTestId('preview-iframe')).toBeInTheDocument();
    expect(getByText('Loading\u2026')).toBeInTheDocument();
  });

  it('should render a modal, 2 buttons, and error message when error is present.', function () {
    const {
      getByRole,
      getAllByRole,
      queryAllByTestId,
      getByText,
    } = renderWithThemeAndFlagsProvider(
      <ApiContext.Provider
        value={{
          state: {
            stories: {
              error: { message: { title: 'error message title' } },
              isLoading: false,
              previewMarkup: '',
            },
          },
          actions: {
            storyApi: {
              createStoryPreviewFromTemplate: jest.fn(),
              clearStoryPreview: jest.fn(),
            },
          },
        }}
      >
        <PreviewStory
          story={completeTemplateObject}
          isTemplate
          handleClose={onClose}
        />
      </ApiContext.Provider>
    );

    const closeButtons = getAllByRole('button');
    expect(closeButtons).toHaveLength(2);

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(queryAllByTestId('preview-iframe')).toHaveLength(0);
    expect(getByText('error message title')).toBeInTheDocument();

    fireEvent.click(closeButtons[0]);
    fireEvent.click(closeButtons[1]);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});
