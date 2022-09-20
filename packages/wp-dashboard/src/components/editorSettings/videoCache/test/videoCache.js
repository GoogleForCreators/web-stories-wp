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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import VideoCache from '..';
import { renderWithProviders } from '../../../../testUtils';

describe('Editor Settings: <VideoCache />', () => {
  it('should render the video cache setting as checked when isEnabled', () => {
    renderWithProviders(<VideoCache updateSettings={jest.fn()} isEnabled />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('should not render the video cache setting as checked when not isEnabled', () => {
    renderWithProviders(<VideoCache updateSettings={jest.fn()} />);

    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('should update settings when the checkbox is clicked.', () => {
    const onChange = jest.fn();
    renderWithProviders(<VideoCache updateSettings={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith({ videoCache: true });
  });
});
