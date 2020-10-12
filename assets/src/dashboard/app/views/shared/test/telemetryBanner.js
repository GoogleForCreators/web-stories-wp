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
import { useState } from 'react';
import userEvent from '@testing-library/user-event';

/**
 * Internal dependencies
 */
import { TelemetryOptInBanner } from '../telemetryBanner';
import { renderWithProviders } from '../../../../testUtils';

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

describe('TelemetryBanner', () => {
  it('should render visible with the checkbox unchecked', () => {
    const { getByRole } = renderWithProviders(<TelemetryBannerTestContainer />);

    const checkbox = getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  it('should change the checkbox to checked and update the header when clicked', () => {
    const { getByRole, getByText } = renderWithProviders(
      <TelemetryBannerTestContainer />
    );

    const checkbox = getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    let bannerHeader = getByText(/Help improve the editor!/);

    expect(bannerHeader).toBeInTheDocument();

    userEvent.click(checkbox);

    expect(checkbox).toBeChecked();

    bannerHeader = getByText(/Your selection has been updated./);
    expect(bannerHeader).toBeInTheDocument();
  });

  it('should close and not be visible when the close icon is clicked', () => {
    const { getByRole } = renderWithProviders(<TelemetryBannerTestContainer />);

    const closeButton = getByRole('button');

    expect(closeButton).toBeInTheDocument();

    userEvent.click(closeButton);

    expect(closeButton).not.toBeInTheDocument();
  });

  it('should not be able to be checked when disabled', () => {
    const { getByRole } = renderWithProviders(
      <TelemetryBannerTestContainer disabled={true} />
    );

    const checkbox = getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    userEvent.click(checkbox);

    expect(checkbox).not.toBeChecked();
  });

  it('should keep focus on the checkbox when checking/unchecking via', () => {
    const { getByRole } = renderWithProviders(<TelemetryBannerTestContainer />);

    const checkbox = getByRole('checkbox');

    // Tab to Dismiss button
    userEvent.tab();

    // Tab to checkbox
    userEvent.tab();

    expect(checkbox).toHaveFocus();

    expect(checkbox).not.toBeChecked();

    // Check the checkbox via keyboard
    userEvent.type(checkbox, '{space}');

    expect(checkbox).toHaveFocus();

    expect(checkbox).toBeChecked();
  });
});
