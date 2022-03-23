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
import { waitFor, fireEvent, screen } from '@testing-library/react';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import TermsDialog from '../panes/media/media3p/termsDialog';

jest.mock('@googleforcreators/design-system', () => ({
  __esModule: true,
  ...jest.requireActual('@googleforcreators/design-system'),
  localStore: {
    setItemByKey: jest.fn(),
    getItemByKey: jest.fn(() => false),
  },
}));

describe('TermsDialog', () => {
  it('should render', () => {
    renderWithTheme(<TermsDialog />);
    const link = screen.queryByLabelText(
      /^Learn more by visiting Web Stories for WordPress/
    );
    expect(link).toMatchSnapshot();
    expect(localStore.getItemByKey).toHaveBeenCalledWith(
      LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P
    );
  });
  it('should store the acknowledgement in the localStore when the window is dismissed', async () => {
    renderWithTheme(<TermsDialog />);
    const dismiss = screen.queryByText(/^Dismiss/);
    expect(localStore.getItemByKey).toHaveBeenCalledWith(
      LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P
    );

    fireEvent.click(dismiss);

    await waitFor(() =>
      expect(localStore.setItemByKey).toHaveBeenCalledWith(
        LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P,
        true
      )
    );
  });
});
