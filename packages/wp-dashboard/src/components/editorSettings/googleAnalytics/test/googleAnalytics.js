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
import { trackClick } from '@googleforcreators/tracking';

jest.mock('@googleforcreators/tracking', () => ({
  trackClick: jest.fn((event, eventName)=>{})
}));

describe('Editor Settings: Google Analytics <GoogleAnalytics />', () => {
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

  it('should render Google Analytics input and helper text by default', () => {
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

  it('should render a visually hidden label for Google Analytics input', () => {
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

  it('should not display any input field when analytics module is active', () => {
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

  it('should allow the input to be active when Site Kit is installed but analytics module is not active', () => {
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

  it('should call mockUpdate when enter is keyed on input', () => {
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

    expect(mockUpdate).toHaveBeenCalledOnce();

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

  it('should call mockUpdate when the save button is clicked', () => {
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

    expect(mockUpdate).toHaveBeenCalledOnce();

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

  it('should call trackClick on clicking when links shown in the GA4 warning are clicked', () => {
    const { rerender } = renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    const input = screen.getByRole('textbox');
    const linkPA = screen.getByText('previously announced').parentElement;
    const linkGA4 = screen.getByText('Google Analytics 4').parentElement;

    fireEvent.change(input, { target: { value: 'UA-098754-33' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    fireEvent.click(linkPA);
    fireEvent.click(linkGA4);
    
    // rerender to get updated googleAnalyticsId and show GA4 warning.
    rerender(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={defaultSiteKitStatus}
        usingLegacyAnalytics={false}
      />
    );

    expect(trackClick).toHaveBeenCalledTimes(2);
    expect(trackClick).toHaveBeenCalledWith(expect.anything(), 'click_ua_deprecation_docs');
    expect(trackClick).toHaveBeenCalledWith(expect.anything(), 'click_ga4_docs');
  });
});
