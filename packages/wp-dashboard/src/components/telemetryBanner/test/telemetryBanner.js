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
import { useState } from '@googleforcreators/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { TelemetryOptInBanner } from '..';
import { renderWithProviders } from '../../../testUtils';

function TelemetryBannerTestContainer(props) {
  const [state, setState] = useState({
    visible: true,
    checked: false,
    disabled: false,
    ...props,
  });

  const onClose = () =>
    setState((prevState) => ({ ...prevState, visible: false }));

  const onChange = () => {
    setState((prevState) => ({
      ...prevState,
      checked: true,
    }));
  };

  return (
    <TelemetryOptInBanner
      visible={state.visible}
      checked={state.checked}
      disabled={state.disabled}
      onChange={onChange}
      onClose={onClose}
    />
  );
}

/* eslint-disable testing-library/no-await-sync-events -- See https://github.com/testing-library/eslint-plugin-testing-library/issues/567 */

describe('TelemetryBanner', () => {
  it('should render visible with the checkbox unchecked', () => {
    renderWithProviders(<TelemetryBannerTestContainer />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  it('should change the checkbox to checked and update the header when clicked', async () => {
    renderWithProviders(<TelemetryBannerTestContainer />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    let bannerHeader = screen.getByText(/Help improve the editor!/);

    expect(bannerHeader).toBeInTheDocument();

    await userEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    bannerHeader = screen.getByText(/Your selection has been updated./);
    expect(bannerHeader).toBeInTheDocument();
  });

  it('should close and not be visible when the close icon is clicked', async () => {
    renderWithProviders(<TelemetryBannerTestContainer />);

    const closeButton = screen.getByRole('button');

    expect(closeButton).toBeInTheDocument();

    await userEvent.click(closeButton);

    expect(closeButton).not.toBeInTheDocument();
  });

  it('should not be able to be checked when disabled', async () => {
    renderWithProviders(<TelemetryBannerTestContainer disabled />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it('should keep focus on the checkbox when checking/unchecking via', async () => {
    renderWithProviders(<TelemetryBannerTestContainer />);

    const checkbox = screen.getByRole('checkbox');

    // Tab to Dismiss button
    await userEvent.tab();

    // Tab to checkbox
    await userEvent.tab();

    expect(checkbox).toHaveFocus();

    expect(checkbox).not.toBeChecked();

    // Check the checkbox via keyboard
    await userEvent.type(checkbox, '{space}');

    expect(checkbox).toHaveFocus();

    expect(checkbox).toBeChecked();
  });
});

/* eslint-enable testing-library/no-await-sync-events */
