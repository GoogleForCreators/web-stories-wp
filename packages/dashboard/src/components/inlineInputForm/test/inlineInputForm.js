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

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils';
import InlineInputForm from '..';

describe('InlineInputForm', () => {
  it('should render a text input field', () => {
    renderWithProviders(
      <InlineInputForm
        onEditComplete={jest.fn}
        onEditCancel={jest.fn}
        value={'some input value'}
        id={'898989'}
        label="my hidden input label"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should call onEditCancel when focus is removed from input', () => {
    const mockCancel = jest.fn();

    renderWithProviders(
      <InlineInputForm
        onEditComplete={jest.fn}
        onEditCancel={mockCancel}
        value={'some input value'}
        id={'898989'}
        label="my hidden input label"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'escape', keyCode: 27 });

    expect(mockCancel).toHaveBeenCalledOnce();
  });

  it('should call onEditComplete when enter is hit from the input', () => {
    const mockComplete = jest.fn();

    renderWithProviders(
      <InlineInputForm
        onEditComplete={mockComplete}
        onEditCancel={jest.fn}
        value={'some input value'}
        id={'898989'}
        label="my hidden input label"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'enter', keyCode: 13 });

    expect(mockComplete).toHaveBeenCalledOnce();
  });
});
