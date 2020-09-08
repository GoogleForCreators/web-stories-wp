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
import { renderWithTheme } from '../../../../../testUtils';
import TelemetrySettings from '../index';

describe('Editor Settings: <TelemetrySettings />', function () {
  it('should render the telemetry as checked when selected is true.', function () {
    const { getByRole } = renderWithTheme(
      <TelemetrySettings
        disabled={false}
        onCheckboxSelected={jest.fn()}
        selected
      />
    );

    expect(getByRole('checkbox')).toBeChecked();
  });

  it('should render the telemetry as not checked when selected is false.', function () {
    const { getByRole } = renderWithTheme(
      <TelemetrySettings
        disabled={false}
        onCheckboxSelected={jest.fn()}
        selected={false}
      />
    );

    expect(getByRole('checkbox')).not.toBeChecked();
  });

  it('should call the change function when the checkbox is clicked.', function () {
    const changeFn = jest.fn();
    const { getByRole } = renderWithTheme(
      <TelemetrySettings
        disabled={false}
        onCheckboxSelected={changeFn}
        selected={false}
      />
    );

    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(changeFn).toHaveBeenCalledTimes(1);
  });
});
