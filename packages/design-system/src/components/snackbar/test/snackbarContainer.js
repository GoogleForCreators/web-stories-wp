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
 * Internal dependencies
 */
import { SnackbarContainer } from '../snackbarContainer';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop, useLiveRegion } from '../../../utils';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  useLiveRegion: jest.fn(),
}));

const NOTIFICATIONS = [
  {
    'aria-label': 'test label',
    message: 'this is my message',
    onDismiss: noop,
  },
  {
    'aria-label': 'test label again',
    message: 'second message',
    onDismiss: noop,
  },
  {
    'aria-label': 'test label again',
    message: 'third one omg',
    onDismiss: noop,
  },
];

const NOTIFICATION_WITH_ACTION_AND_HELP_TEXT = {
  'aria-label': 'test label again',
  message: 'third one omg',
  onDismiss: noop,
  actionLabel: 'Derp',
  actionHelpText: "Get out 'ma swamp",
};

describe('SnackbarContainer', () => {
  const mockUseLiveRegion = useLiveRegion;
  const mockSpeak = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLiveRegion.mockReturnValue(mockSpeak);
  });

  it('should announce messages', () => {
    const { rerender } = renderWithProviders(
      <SnackbarContainer notifications={[]} />
    );

    expect(mockSpeak).toHaveBeenCalledTimes(0);

    rerender(<SnackbarContainer notifications={[NOTIFICATIONS[0]]} />);

    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockSpeak).toHaveBeenCalledWith(NOTIFICATIONS[0].message);

    rerender(<SnackbarContainer notifications={NOTIFICATIONS} />);

    expect(mockSpeak).toHaveBeenCalledTimes(3);
    expect(mockSpeak).toHaveBeenCalledWith(NOTIFICATIONS[1].message);
    expect(mockSpeak).toHaveBeenCalledWith(NOTIFICATIONS[2].message);
  });

  it('should announce help text for an action', () => {
    const { rerender } = renderWithProviders(
      <SnackbarContainer notifications={[]} />
    );

    expect(mockSpeak).toHaveBeenCalledTimes(0);

    rerender(
      <SnackbarContainer
        notifications={[
          {
            ...NOTIFICATIONS[0],
            actionHelpText: 'click this button for christmas every day',
          },
        ]}
      />
    );

    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockSpeak).toHaveBeenCalledWith(
      `${NOTIFICATIONS[0].message} click this button for christmas every day`
    );

    rerender(
      <SnackbarContainer
        notifications={[NOTIFICATION_WITH_ACTION_AND_HELP_TEXT]}
      />
    );

    expect(mockSpeak).toHaveBeenCalledTimes(2);
    expect(mockSpeak).toHaveBeenCalledWith(
      `${NOTIFICATION_WITH_ACTION_AND_HELP_TEXT.message} ${NOTIFICATION_WITH_ACTION_AND_HELP_TEXT.actionHelpText}`
    );
  });
});
