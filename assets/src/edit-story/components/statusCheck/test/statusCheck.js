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
  waitFor,
} from '@testing-library/react';
import Modal from 'react-modal';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../testUtils';
import ConfigContext from '../../../app/config/context';
import APIContext from '../../../app/api/context';
import StatusCheck from '../statusCheck';

function setup(response) {
  const configValue = { api: { statusCheck: '' }, metadata: { publisher: '' } };

  const getStatusCheck = () => response;
  const apiValue = { actions: { getStatusCheck } };

  const { queryAllByRole, container } = renderWithTheme(
    <ConfigContext.Provider value={configValue}>
      <APIContext.Provider value={apiValue}>
        <StatusCheck />
      </APIContext.Provider>
    </ConfigContext.Provider>
  );
  return { queryAllByRole, container };
}

describe('statusCheck', () => {
  let modalWrapper;

  beforeAll(() => {
    modalWrapper = document.createElement('aside');
    document.documentElement.appendChild(modalWrapper);
    Modal.setAppElement(modalWrapper);
  });

  afterAll(() => {
    document.documentElement.removeChild(modalWrapper);
  });

  it('should do nothing if successfull', () => {
    setup(Promise.resolve({ success: true }));

    const dialog = screen.queryByRole('dialog');
    expect(dialog).toBeNull();
  });

  it('should display dismissible dialog if failed', async () => {
    setup(Promise.reject(new Error('api failed')));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeDefined();
    });

    const dismiss = screen.getByRole('button', { name: /Dismiss/i });
    expect(dismiss).toBeDefined();
    fireEvent.click(dismiss);

    await waitForElementToBeRemoved(() => screen.getByRole('dialog'));
  });
});
