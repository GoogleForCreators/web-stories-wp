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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import GoogleAdSenseSettings, { TEXT } from '..';
import { renderWithProviders } from '../../../../../testUtils';

describe('Editor Settings: Google AdSense <GoogleAdSense />', () => {
  let publisherId;
  let slotId;
  let mockUpdatePublisherId;
  let mockUpdateSlotId;

  beforeEach(() => {
    publisherId = '';
    slotId = '';
    mockUpdatePublisherId = jest.fn((id) => {
      publisherId = id;
    });
    mockUpdateSlotId = jest.fn((id) => {
      slotId = id;
    });
  });

  afterEach(() => {
    publisherId = '';
    slotId = '';
  });

  it('should render google AdSense input and helper text by default', () => {
    renderWithProviders(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    const adSensePublisherIdInput = screen.getByTestId('adSensePublisherId');
    expect(adSensePublisherIdInput).toBeInTheDocument();

    const adSenseSlotIdInput = screen.getByTestId('adSenseSlotId');
    expect(adSenseSlotIdInput).toBeInTheDocument();

    const idLabel = screen.getByText(TEXT.PUBLISHER_ID_LABEL);
    expect(idLabel).toBeInTheDocument();

    const slotIdLabel = screen.getByText(TEXT.SLOT_ID_LABEL);
    expect(slotIdLabel).toBeInTheDocument();
  });

  it('should render a visually hidden label for inputs', () => {
    renderWithProviders(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    const label1 = screen.getByLabelText(TEXT.SLOT_ID_LABEL);
    expect(label1).toBeInTheDocument();

    const label2 = screen.getByLabelText(TEXT.PUBLISHER_ID_LABEL);
    expect(label2).toBeInTheDocument();
  });

  it('should call mockUpdatePublisherId when enter is keyed on input', () => {
    const { rerender } = renderWithProviders(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    const input = screen.getByTestId('adSensePublisherId');

    fireEvent.change(input, { target: { value: 'pub-1234567891234567' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdatePublisherId).toHaveBeenCalledOnce();

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdatePublisherId).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(mockUpdatePublisherId).toHaveBeenCalledTimes(2);
  });

  it('should call mockUpdatePublisherId when the save button is clicked', () => {
    const { rerender } = renderWithProviders(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    const input = screen.getByTestId('adSensePublisherId');
    const button = screen.getByTestId('adSensePublisherIdButton');

    fireEvent.change(input, { target: { value: 'pub-1234567891234567' } });

    fireEvent.click(button);

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdatePublisherId).toHaveBeenCalledOnce();

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(button);

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdatePublisherId).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.click(button);

    expect(mockUpdatePublisherId).toHaveBeenCalledTimes(2);
  });

  it('should call mockUpdateSlotId when enter is keyed on input', () => {
    const { rerender } = renderWithProviders(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    const input = screen.getByTestId('adSenseSlotId');

    fireEvent.change(input, { target: { value: '0123456789' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdateSlotId).toHaveBeenCalledOnce();

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdateSlotId).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

    expect(mockUpdateSlotId).toHaveBeenCalledTimes(2);
  });

  it('should call mockUpdateSlotId when the save button is clicked', () => {
    const { rerender } = renderWithProviders(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    const input = screen.getByTestId('adSenseSlotId');
    const button = screen.getByTestId('adSenseSlotIdButton');

    fireEvent.change(input, { target: { value: '0123456789' } });

    fireEvent.click(button);

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdateSlotId).toHaveBeenCalledOnce();

    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(button);

    // rerender to get updated publisherId prop
    rerender(
      <GoogleAdSenseSettings
        publisherId={publisherId}
        slotId={slotId}
        handleUpdatePublisherId={mockUpdatePublisherId}
        handleUpdateSlotId={mockUpdateSlotId}
      />
    );

    expect(mockUpdateSlotId).toHaveBeenCalledTimes(2);

    fireEvent.change(input, { target: { value: 'NOT A VALID ID!!!' } });

    fireEvent.click(button);

    expect(mockUpdateSlotId).toHaveBeenCalledTimes(2);
  });
});
