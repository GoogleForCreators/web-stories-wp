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
import { fireEvent, render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import GoogleAnalyticsSettings, { TEXT, ANALYTICS_DROPDOWN_OPTIONS } from '..';
import { renderWithProviders } from '../../../../testUtils';
import { describe } from 'node:test';

const DROPDOWN_LABELS = {
  SITE_KIT: 'Use Site Kit for analytics (default)',
  WEB_STORIES: 'Use only Web Stories for analytics',
  BOTH: 'Use both',
};

const SITE_KIT_MESSAGE =
  'Site Kit by Google has already enabled Google Analytics for your Web Stories, all changes to your analytics tracking should occur there.';

const SITE_KIT_MESSAGE_TEST_DATA = [
  ['show', DROPDOWN_LABELS.SITE_KIT, true],
  ['not show', DROPDOWN_LABELS.WEB_STORIES, false],
  ['not show', DROPDOWN_LABELS.BOTH, false],
];

describe('Editor Settings: Google Analytics <GoogleAnalytics />', () => {
  let googleAnalyticsId;
  let mockUpdate;
  let mockHandleUpdateGoogleAnalyticsHandler;
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
    mockHandleUpdateGoogleAnalyticsHandler = jest.fn();
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

  it('should display input field when analytics module is active', () => {
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
    expect(input).toBeInTheDocument();
  });

  it('should display analytics type dropdown when analytics module is active', () => {
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

    const dropdown = screen.getByLabelText(TEXT.ANALYTICS_DROPDOWN_LABEL);
    expect(dropdown).toBeInTheDocument();
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

  it.each(SITE_KIT_MESSAGE_TEST_DATA)(
    'should %s specific message on selecting %s',
    (_, optionLabel, shouldDisplayMessage) => {
      renderWithProviders(
        <GoogleAnalyticsSettings
          googleAnalyticsId={googleAnalyticsId}
          handleUpdateAnalyticsId={mockUpdate}
          siteKitStatus={{
            ...defaultSiteKitStatus,
            analyticsActive: true,
          }}
          usingLegacyAnalytics={false}
          handleUpdateGoogleAnalyticsHandler={
            mockHandleUpdateGoogleAnalyticsHandler
          }
        />
      );

      const dropdown = screen.getByLabelText(TEXT.ANALYTICS_DROPDOWN_LABEL);
      fireEvent.click(dropdown);

      const optionElement = screen.getByText(optionLabel);
      fireEvent.click(optionElement);

      if (shouldDisplayMessage) {
        expect(screen.queryByText(SITE_KIT_MESSAGE)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(SITE_KIT_MESSAGE)).not.toBeInTheDocument();
      }
    }
  );

  it('should call handleUpdateGoogleAnalyticsHandler when the dropdown value changes', () => {
    renderWithProviders(
      <GoogleAnalyticsSettings
        googleAnalyticsId={googleAnalyticsId}
        handleUpdateAnalyticsId={mockUpdate}
        siteKitStatus={{
          ...defaultSiteKitStatus,
          analyticsActive: true,
        }}
        usingLegacyAnalytics={false}
        handleUpdateGoogleAnalyticsHandler={
          mockHandleUpdateGoogleAnalyticsHandler
        }
      />
    );

    const dropdown = screen.getByLabelText(TEXT.ANALYTICS_DROPDOWN_LABEL);
    fireEvent.click(dropdown);

    ANALYTICS_DROPDOWN_OPTIONS.forEach((option) => {
      const optionElement = screen.getByText(option.label);
      fireEvent.click(optionElement);
      expect(mockHandleUpdateGoogleAnalyticsHandler).toHaveBeenCalledWith(
        option.value
      );
    });
  });
});
