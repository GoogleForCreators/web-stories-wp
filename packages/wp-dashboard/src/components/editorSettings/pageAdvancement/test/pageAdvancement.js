/*
 * Copyright 2021 Google LLC
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
import PageAdvancementSetting from '..';
import { renderWithProviders } from '../../../../testUtils';

describe('Editor Settings: <PageAdvancementSetting />', () => {
  it('should render the only the advancement setting when auto-advance is false', () => {
    renderWithProviders(
      <PageAdvancementSetting
        updateSettings={jest.fn()}
        autoAdvance={false}
        defaultPageDuration={1}
      />
    );

    const radioGroup = screen.queryByRole('radiogroup');
    expect(radioGroup).toBeInTheDocument();

    const input = screen.queryByRole('textbox');
    expect(input).not.toBeInTheDocument();
  });

  it('should not render the page duration setting when auto-advance is true', () => {
    renderWithProviders(
      <PageAdvancementSetting
        updateSettings={jest.fn()}
        autoAdvance
        defaultPageDuration={1}
      />
    );

    const input = screen.queryByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should update auto-advance setting', () => {
    const onChange = jest.fn();
    renderWithProviders(
      <PageAdvancementSetting
        updateSettings={onChange}
        autoAdvance
        defaultPageDuration={1}
      />
    );

    const switchButton = screen.queryByLabelText('Manual');
    fireEvent.click(switchButton);

    expect(onChange).toHaveBeenCalledOnceWith({ autoAdvance: false });
  });

  it('should update page duration setting', () => {
    const onChange = jest.fn();
    renderWithProviders(
      <PageAdvancementSetting
        updateSettings={onChange}
        autoAdvance
        defaultPageDuration={1}
      />
    );

    const input = screen.getByLabelText('Duration');
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledOnce();
  });
});
