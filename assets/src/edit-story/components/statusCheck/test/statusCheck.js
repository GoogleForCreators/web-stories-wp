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
 * Internal dependencies
 */
/**
 * External dependencies
 */
import { FlagsProvider } from 'flagged';
import { renderWithTheme } from '../../../testUtils';
import ConfigContext from '../../../app/config/context';
import APIContext from '../../../app/api/context';
import StatusCheck from '../statusCheck';
/**
 * External dependencies
 */

function setup(response) {
  const configValue = { api: { statusCheck: '' }, metadata: { publisher: '' } };

  const apiValue = {
    actions: {
      getStatusCheck: () => response,
    },
  };

  const { queryAllByRole, container } = renderWithTheme(
    <FlagsProvider
      features={{
        statusCheck: true,
      }}
    >
      <ConfigContext.Provider value={configValue}>
        <APIContext.Provider value={apiValue}>
          <StatusCheck />
        </APIContext.Provider>
      </ConfigContext.Provider>
    </FlagsProvider>
  );
  return { queryAllByRole, container };
}

describe('statusCheck', () => {
  it('successful', () => {
    setup(Promise.resolve({ success: true }));
    // todo add a test here.
    expect(true).toBeTrue();
  });
  it('failure', () => {
    setup(Promise.reject(new Error('api failed')));
    // todo add a test here.
    expect(true).toBeTrue();
  });
});
