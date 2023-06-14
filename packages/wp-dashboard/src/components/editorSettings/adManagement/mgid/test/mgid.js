/*
 * Copyright 2023 Google LLC
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
import MgidSettings, { TEXT } from '..';
import { renderWithProviders } from '../../../../../testUtils';

describe('Editor Settings: MGID <Mgid />', () => {
  let mgidWidgetIdtId;
  let mockUpdate;

  beforeEach(() => {
    mgidWidgetIdtId = '';
    mockUpdate = jest.fn((id) => {
      mgidWidgetIdtId = id;
    });
  });

  afterEach(() => {
    mgidWidgetIdtId = '';
  });

  it('should render a visually hidden label for MGID input', () => {
    renderWithProviders(
      <MgidSettings widgetId={mgidWidgetIdtId} handleUpdate={mockUpdate} />
    );

    const label = screen.getByLabelText(TEXT.WIDGET_ID_LABEL);
    expect(label).toBeInTheDocument();
  });

  it('should call mockUpdate when enter is keyed on input', () => {
    const { rerender } = renderWithProviders(
      <MgidSettings widgetId={mgidWidgetIdtId} handleUpdate={mockUpdate} />
    );

    const input = screen.getByRole('textbox');

    fireEvent.change(input, {
      target: { value: '1234567890' },
    });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated mgidWidgetIdtId prop
    rerender(
      <MgidSettings widgetId={mgidWidgetIdtId} handleUpdate={mockUpdate} />
    );

    expect(mockUpdate).toHaveBeenCalledOnce();

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated mgidWidgetId prop
    rerender(
      <MgidSettings widgetId={mgidWidgetIdtId} handleUpdate={mockUpdate} />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  it('should call mockUpdate when the save button is clicked', () => {
    const { rerender } = renderWithProviders(
      <MgidSettings widgetId={mgidWidgetIdtId} handleUpdate={mockUpdate} />
    );

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, {
      target: { value: '1234567890' },
    });

    fireEvent.click(button);

    // rerender to get updated mgidWidgetId prop
    rerender(
      <MgidSettings widgetId={mgidWidgetIdtId} handleUpdate={mockUpdate} />
    );

    expect(mockUpdate).toHaveBeenCalledOnce();

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(button);

    // rerender to get updated mgidWidgetId prop
    rerender(
      <MgidSettings widgetId={mgidWidgetIdtId} handleUpdate={mockUpdate} />
    );

    expect(mockUpdate).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.click(button);

    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
