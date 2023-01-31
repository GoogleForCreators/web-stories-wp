/*
 * Copyright 2021 Google LLC
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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import MediaInput from '../mediaInput';
import { renderWithProviders } from '../../../testUtils';

const openMediaPicker = jest.fn();

describe('mediaInput', () => {
  it('should have image', () => {
    renderWithProviders(
      <MediaInput
        openMediaPicker={openMediaPicker}
        value={'http://www.example.com/test.jpg'}
      />
    );
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  it('should have upload button', () => {
    renderWithProviders(<MediaInput openMediaPicker={openMediaPicker} />);
    const button = screen.queryByLabelText('Choose an image');
    expect(button).toBeInTheDocument();
  });
  it('should not have upload button', () => {
    renderWithProviders(
      <MediaInput openMediaPicker={openMediaPicker} canUpload={false} />
    );
    const button = screen.queryByLabelText('Choose an image');
    expect(button).not.toBeInTheDocument();
  });
});
