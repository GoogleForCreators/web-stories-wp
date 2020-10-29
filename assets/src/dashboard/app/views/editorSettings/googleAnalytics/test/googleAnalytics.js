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
import GoogleAnalyticsSettings, { TEXT } from '../';

describe('Editor Settings: Google Analytics <GoogleAnalytics />', function () {
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

  it('should render google analytics input and helper text by default', function () {
    const { getByRole, getByText } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    const input = getByRole('textbox');
    expect(input).toBeDefined();
    expect(input).toBeEnabled();

    const sectionHeader = getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();
  });

  it('should render a visually hidden label for google analytics input', function () {
    const { getByLabelText } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    const label = getByLabelText(TEXT.ARIA_LABEL);
    expect(label).toBeInTheDocument();
  });

  it('should not allow the input to be active when site kit is active', function () {
    const { getByRole } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
        siteKitCapabilities={{
          analyticsModuleActive: false,
          canActivatePlugins: true,
          canInstallPlugins: true,
          siteKitActive: true,
          siteKitInstalled: true,
        }}
      />
    );

    const input = getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should not allow the input to be active when site kit is installed', function () {
    const { getByRole } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
        siteKitCapabilities={{
          analyticsModuleActive: false,
          canActivatePlugins: true,
          canInstallPlugins: true,
          siteKitActive: false,
          siteKitInstalled: true,
        }}
      />
    );

    const input = getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should call mockUpdate when enter is keyed on input', function () {
    let { getByRole, rerender } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    let input = getByRole('textbox');

    fireEvent.change(input, { target: { value: 'UA-098754-33' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  it('should call mockUpdate when the save button is clicked', function () {
    const { getByRole, rerender } = renderWithProviders(
      <GoogleAnalyticsSettings
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
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(button);

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAnalyticsSettings
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
