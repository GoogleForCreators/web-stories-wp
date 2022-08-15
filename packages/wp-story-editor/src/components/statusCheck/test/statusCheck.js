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
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { setAppElement } from '@googleforcreators/design-system';
import { ConfigContext } from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import StatusCheck from '../statusCheck';

jest.mock('../../../api/statusCheck');
import { getStatusCheck } from '../../../api/statusCheck';

function setup() {
  const configValue = { api: { statusCheck: '' }, metadata: { publisher: '' } };

  return renderWithTheme(
    <ConfigContext.Provider value={configValue}>
      <StatusCheck />
    </ConfigContext.Provider>
  );
}

describe('statusCheck', () => {
  let modalWrapper;

  beforeAll(() => {
    modalWrapper = document.createElement('aside');
    document.documentElement.appendChild(modalWrapper);
    setAppElement(modalWrapper);
  });

  afterAll(() => {
    document.documentElement.removeChild(modalWrapper);
  });

  it('should do nothing if successful', async () => {
    getStatusCheck.mockReturnValue(Promise.resolve({ success: true }));

    setup();

    // This seems to be the best way to validate, that a certain
    // element does *not* appear. Not very elegant, though.
    await expect(screen.findByRole('dialog')).rejects.toThrow(
      /Unable to find role="dialog"/
    );
  });

  it('should display dismissible dialog if failed', async () => {
    getStatusCheck.mockReturnValue(Promise.reject(new Error('api failed')));

    setup();

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const dismiss = screen.getByRole('button', { name: /Dismiss/i });
    expect(dismiss).toBeInTheDocument();
    fireEvent.click(dismiss);

    await waitForElementToBeRemoved(dialog);
  });
});
