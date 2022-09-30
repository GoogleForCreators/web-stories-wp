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
import { fireEvent, createEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils';
import FileUpload from '..';

describe('FileUpload', () => {
  it('should render upload component by default', () => {
    renderWithProviders(
      <FileUpload
        onSubmit={jest.fn}
        id={'898989'}
        label="Upload"
        ariaLabel="Click to upload a file"
      />
    );
    expect(
      screen.queryByTestId('file-upload-content-container')
    ).not.toBeInTheDocument();
  });

  it('should render upload component with loading overlay when isLoading is true', () => {
    renderWithProviders(
      <FileUpload
        onSubmit={jest.fn}
        id={'898989'}
        label="Upload"
        ariaLabel="Click to upload a file"
        isLoading
      />
    );
    expect(screen.getByText(/^Loading/)).toBeInTheDocument();
  });

  it('should trigger onSubmit when file is added through input', () => {
    const onSubmitMock = jest.fn();

    renderWithProviders(
      <FileUpload
        onSubmit={onSubmitMock}
        id={'898989'}
        label="Upload"
        ariaLabel="Click to upload a file"
      />
    );

    const UploadInput = screen.getByTestId('upload-file-input');
    expect(UploadInput).toBeInTheDocument();
    fireEvent.click(UploadInput);
    fireEvent.change(UploadInput, { target: { files: {} } });
    expect(onSubmitMock).toHaveBeenCalledOnce();
  });

  it('should trigger onSubmit when file is dropped in container', () => {
    const onSubmitMock = jest.fn();

    const mockFile = new File([''], 'mockfile.png', {
      type: 'image/png',
    });
    renderWithProviders(
      <FileUpload
        onSubmit={onSubmitMock}
        id={'898989'}
        label="Upload"
        ariaLabel="Click to upload a file"
      />
    );

    const DropArea = screen.getByTestId('file-upload-drop-area');
    expect(DropArea).toBeInTheDocument();

    const dropEvent = createEvent.drop(DropArea);
    const fileList = [mockFile];

    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        files: {
          item: (itemIndex) => fileList[itemIndex],
          length: fileList.length,
        },
      },
    });

    fireEvent(DropArea, dropEvent);

    expect(onSubmitMock).toHaveBeenCalledOnce();
  });
});
