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
import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import {
  LOCAL_STORAGE_PREFIX,
  localStore,
  setAppElement,
} from '@googleforcreators/design-system';
import { APIContext } from '@googleforcreators/story-editor';
import { FlagsProvider } from 'flagged';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import CorsCheck from '../corsCheck.js';

const getMediaForCorsCheck = jest.fn();

jest.mock('@googleforcreators/design-system', () => ({
  __esModule: true,
  ...jest.requireActual('@googleforcreators/design-system'),
  localStore: {
    setItemByKey: jest.fn(),
    getItemByKey: jest.fn(() => false),
  },
}));

function setup() {
  const apiData = {
    actions: {
      getMediaForCorsCheck,
    },
  };

  return renderWithTheme(
    <FlagsProvider
      features={{
        enableCORSCheck: true,
      }}
    >
      <APIContext.Provider value={apiData}>
        <CorsCheck />
      </APIContext.Provider>
    </FlagsProvider>
  );
}

describe('corsCheck', () => {
  let modalWrapper;

  const fetchSpy = jest.spyOn(window, 'fetch');

  beforeAll(() => {
    fetchSpy.mockResolvedValue({
      text: () => ({
        status: 200,
      }),
    });
    modalWrapper = document.createElement('aside');
    document.documentElement.appendChild(modalWrapper);
    setAppElement(modalWrapper);
  });

  afterAll(() => {
    document.documentElement.removeChild(modalWrapper);
    fetchSpy.mockClear();
  });

  it('should do nothing if rest api returns nothing', async () => {
    getMediaForCorsCheck.mockResolvedValue([]);
    setup();

    // This seems to be the best way to validate, that a certain
    // element does *not* appear. Not very elegant, though.
    await expect(screen.findByRole('dialog')).rejects.toThrow(
      /Unable to find role="dialog"/
    );
  });

  it('should do nothing if successful', async () => {
    getMediaForCorsCheck.mockResolvedValue(['https://example.com/logo.png']);
    setup();

    // This seems to be the best way to validate, that a certain
    // element does *not* appear. Not very elegant, though.
    await expect(screen.findByRole('dialog')).rejects.toThrow(
      /Unable to find role="dialog"/
    );
  });

  it('should do nothing if same origin', async () => {
    getMediaForCorsCheck.mockResolvedValue(['http://localhost/logo.png']);
    setup();

    // This seems to be the best way to validate, that a certain
    // element does *not* appear. Not very elegant, though.
    await expect(screen.findByRole('dialog')).rejects.toThrow(
      /Unable to find role="dialog"/
    );
  });

  it('should do nothing if rest api returns error', async () => {
    getMediaForCorsCheck.mockRejectedValue(() => new Error('api failed'));
    setup();

    // This seems to be the best way to validate, that a certain
    // element does *not* appear. Not very elegant, though.
    await expect(screen.findByRole('dialog')).rejects.toThrow(
      /Unable to find role="dialog"/
    );
  });

  it('should display dismissible dialog if failed', async () => {
    getMediaForCorsCheck.mockResolvedValue(['https://example.com/logo.png']);
    fetchSpy.mockRejectedValue(() => new Error('request failed'));

    setup();
    expect(localStore.getItemByKey).toHaveBeenCalledWith(
      LOCAL_STORAGE_PREFIX.CORS_WARNING_DIALOG_DISMISSED
    );

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const dismiss = screen.getByRole('button', { name: /Dismiss/i });
    expect(dismiss).toBeInTheDocument();
    fireEvent.click(dismiss);

    await waitForElementToBeRemoved(dialog);

    await waitFor(() =>
      expect(localStore.setItemByKey).toHaveBeenCalledWith(
        LOCAL_STORAGE_PREFIX.CORS_WARNING_DIALOG_DISMISSED,
        true
      )
    );
  });
});
