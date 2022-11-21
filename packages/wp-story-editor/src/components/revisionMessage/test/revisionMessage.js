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
import { ConfigContext } from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import RevisionMessage from '../revisionMessage';

const mockShowSnackbar = jest.fn();
jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
}));

function setup({ extraConfigValue = {} }) {
  const configValue = {
    revisionMessage: '',
    ...extraConfigValue,
  };

  return renderWithTheme(
    <ConfigContext.Provider value={configValue}>
      <RevisionMessage />
    </ConfigContext.Provider>
  );
}
describe('RevisionMessage.', () => {
  beforeEach(() => {
    mockShowSnackbar.mockReset();
  });

  it('should not display snackbar', () => {
    setup({});

    expect(mockShowSnackbar).not.toHaveBeenCalled();
  });

  it('should display snackbar', () => {
    setup({
      extraConfigValue: {
        revisionMessage: 'Foobar',
      },
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith({
      dismissible: true,
      message: 'Foobar',
    });
  });
});
