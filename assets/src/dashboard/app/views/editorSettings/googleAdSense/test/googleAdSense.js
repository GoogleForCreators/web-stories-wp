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
import { renderWithProviders } from '../../../../../testUtils';
import GoogleAdSenseSettings, { TEXT } from '../';

describe('Editor Settings: Google AdSense <GoogleAdSense />', function () {
  let googleAnalyticsId;
  let mockUpdate;

  beforeEach(() => {
    googleAnalyticsId = '';
    mockUpdate = jest.fn((id) => {
      googleAnalyticsId = id;
    });
  });

  afterEach(() => {
    googleAnalyticsId = '';
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render google analytics input and helper text by default', function () {
    const { getByRole, getByText } = renderWithProviders(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    const input = getByRole('textbox');
    expect(input).toBeDefined();

    const sectionHeader = getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render a visually hidden label for google analytics input', function () {
    const { getByLabelText } = renderWithProviders(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    const label = getByLabelText(TEXT.SLOT_ID_LABEL);
    expect(label).toBeInTheDocument();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call mockUpdate when enter is keyed on input', function () {
    let { getByRole, rerender } = renderWithProviders(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    let input = getByRole('textbox');

    fireEvent.change(input, { target: { value: 'UA-098754-33' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should call mockUpdate when the save button is clicked', function () {
    const { getByRole, rerender } = renderWithProviders(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    const input = getByRole('textbox');
    const button = getByRole('button');

    fireEvent.change(input, { target: { value: 'UA-098754-33' } });

    fireEvent.click(button);

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(button);

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAdSenseSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.click(button);

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
