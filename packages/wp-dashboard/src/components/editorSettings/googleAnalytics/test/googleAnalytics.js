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
import GoogleAnalyticsSettings, { TEXT } from '..';
import { renderWithProviders } from '../../../../testUtils';

describe('Editor Settings: Google Analytics <GoogleAnalytics />', function () {
  let googleAnalyticsId;
  let mockUpdate;
  const defaultSiteKitStatus = {
    installed: false,
    analyticsActive: false,
    active: false,
  };

  beforeEach(() => {
    googleAnalyticsId = '';
    mockUpdate = jest.fn((id) => {
      googleAnalyticsId = id;
    });
  });

  afterEach(() => {
    googleAnalyticsId = '';
  });

  it('should render Google Analytics input and helper text by default', function () {
    renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toBeEnabled();

    const sectionHeader = screen.getByText(TEXT.SECTION_HEADING);
    expect(sectionHeader).toBeInTheDocument();
  });

  it('should render a visually hidden label for Google Analytics input', function () {
    renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    const label = screen.getByLabelText(TEXT.ARIA_LABEL);
    expect(label).toBeInTheDocument();
  });

  it('should not display any input field when analytics module is active', function () {
    renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={{
          ...defaultSiteKitStatus,
          active: true,
          analyticsActive: true,
        }}
        usingLegacyAnalytics={false}
      />
    );

    const input = screen.queryByRole('textbox');
    expect(input).not.toBeInTheDocument();
  });

  it('should allow the input to be active when Site Kit is installed but analytics module is not active', function () {
    renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={{
          ...defaultSiteKitStatus,
          active: false,
          installed: true,
        }}
        usingLegacyAnalytics={false}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeEnabled();
  });

  it('should call mockUpdate when enter is keyed on input', function () {
    const { rerender } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'UA-098754-33' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  it('should call mockUpdate when the save button is clicked', function () {
    const { rerender } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'UA-098754-33' } });

    fireEvent.click(button);

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(button);

    // rerender to get updated googleAnalyticsId prop
    rerender(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.click(button);

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
