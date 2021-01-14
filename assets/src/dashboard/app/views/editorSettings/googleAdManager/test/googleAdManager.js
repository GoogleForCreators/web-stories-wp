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
import { renderWithProviders } from '../../../../../testUtils';
import GoogleAdManagerSettings, { TEXT } from '../';

describe('Editor Settings: Google Analytics <GoogleAdManager />', function () {
  let adManagerSlotId;
  let mockUpdate;

  beforeEach(() => {
    adManagerSlotId = '';
    mockUpdate = jest.fn((id) => {
      adManagerSlotId = id;
    });
  });

  afterEach(() => {
    adManagerSlotId = '';
  });

  it('should render a visually hidden label for Google Ad Manager input', function () {
    const { getByLabelText } = renderWithProviders(
      <GoogleAdManagerSettings
        adManagerSlotId={adManagerSlotId}
        handleUpdate={mockUpdate}
      />
    );

    const label = getByLabelText(TEXT.SLOT_ID_LABEL);
    expect(label).toBeInTheDocument();
  });

  it('should call mockUpdate when enter is keyed on input', function () {
    const { getByRole, rerender } = renderWithProviders(
      <GoogleAdManagerSettings
        adManagerSlotId={adManagerSlotId}
        handleUpdate={mockUpdate}
      />
    );

    const input = getByRole('textbox');

    fireEvent.change(input, {
      target: { value: '/123456789/a4a/amp_story_dfp_example' },
    });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated adManagerSlotId prop
    rerender(
      <GoogleAdManagerSettings
        adManagerSlotId={adManagerSlotId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated adManagerSlotId prop
    rerender(
      <GoogleAdManagerSettings
        adManagerSlotId={adManagerSlotId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  it('should call mockUpdate when the save button is clicked', function () {
    const { getByRole, rerender } = renderWithProviders(
      <GoogleAdManagerSettings
        adManagerSlotId={adManagerSlotId}
        handleUpdate={mockUpdate}
      />
    );

    const input = getByRole('textbox');
    const button = getByRole('button');

    fireEvent.change(input, {
      target: { value: '/123456789/a4a/amp_story_dfp_example' },
    });

    fireEvent.click(button);

    // rerender to get updated adManagerSlotId prop
    rerender(
      <GoogleAdManagerSettings
        adManagerSlotId={adManagerSlotId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(button);

    // rerender to get updated adManagerSlotId prop
    rerender(
      <GoogleAdManagerSettings
        adManagerSlotId={adManagerSlotId}
        handleUpdate={mockUpdate}
      />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.click(button);

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
