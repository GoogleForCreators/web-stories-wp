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
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { ALERT_SEVERITY } from '../constants';
import { Alert } from '../';

describe('Alert', () => {
  it('should render 1 alert', () => {
    const wrapper = renderWithProviders(
      <Alert message={'this is an error'} severity={ALERT_SEVERITY.ERROR} />
    );

    const alert = wrapper.getByRole('alert');

    expect(alert).toBeInTheDocument();
  });
  it('should render 1 alert with a title', () => {
    const wrapper = renderWithProviders(
      <Alert
        message={'this is an error'}
        title={'this is an alert title'}
        severity={ALERT_SEVERITY.ERROR}
      />
    );

    const alert = wrapper.getByText('this is an alert title');

    expect(alert).toBeInTheDocument();
  });

  it('should recognize click on DismissButton', () => {
    const mockDismissClick = jest.fn();
    const { getByRole } = renderWithProviders(
      <Alert
        isAllowDismiss={true}
        message={'this is an error'}
        severity={ALERT_SEVERITY.ERROR}
        handleDismiss={mockDismissClick}
      />
    );

    const button = getByRole('button');

    fireEvent.click(button);

    expect(mockDismissClick).toHaveBeenCalledTimes(1);
  });
});
