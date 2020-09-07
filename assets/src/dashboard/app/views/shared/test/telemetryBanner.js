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
 * Internal dependencies
 */
/**
 * External dependencies
 */
const { useState } = require('react');
const { fireEvent } = require('@testing-library/react');
const { TelemetryOptInBanner } = require('../telemetryBanner');
const { renderWithTheme } = require('../../../../testUtils');

function TelemetryBannerTestContainer() {
  const [state, setState] = useState({
    visible: true,
    checked: false,
    disabled: false,
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
    const { getByRole } = renderWithTheme(<TelemetryBannerTestContainer />);

    const checkbox = getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  it('should change the checkbox to checked when clicked', () => {
    const { getByRole } = renderWithTheme(<TelemetryBannerTestContainer />);

    const checkbox = getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('should close and not be visible when the close icon is clicked', () => {
    const { getByRole } = renderWithTheme(<TelemetryBannerTestContainer />);

    const closeButton = getByRole('button');

    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    expect(closeButton).not.toBeInTheDocument();
  });
});
