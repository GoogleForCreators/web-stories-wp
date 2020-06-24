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
import { renderWithTheme } from '../../../testUtils/';
import Toaster from '../toaster';
import { ALERT_SEVERITY } from '../../../constants';

const testToast = {
  message: 'i am an error',
  severity: ALERT_SEVERITY.ERROR,
  id: 1,
};

describe('Toaster', () => {
  const mockRemoveToastClick = jest.fn();
  it('should have 1 active toast', () => {
    const { getByRole } = renderWithTheme(
      <Toaster
        activeToasts={[testToast]}
        isAllowEarlyDismiss={false}
        handleRemoveToast={mockRemoveToastClick}
      />
    );

    const alert = getByRole('alert');

    expect(alert).toBeInTheDocument();
  });

  it('should not load dismiss button when isAllowEarlyDismiss is false', () => {
    const { queryAllByRole } = renderWithTheme(
      <Toaster
        activeToasts={[testToast]}
        isAllowEarlyDismiss={false}
        handleRemoveToast={mockRemoveToastClick}
      />
    );

    const button = queryAllByRole('button');

    expect(button).toHaveLength(0);
  });

  it('should load dismiss button when isAllowEarlyDismiss is true', () => {
    const { getByRole } = renderWithTheme(
      <Toaster
        activeToasts={[testToast]}
        isAllowEarlyDismiss={true}
        handleRemoveToast={mockRemoveToastClick}
      />
    );

    const button = getByRole('button');

    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockRemoveToastClick).toHaveBeenCalledTimes(1);
  });
});
