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
import { waitFor, fireEvent, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import TermsDialog from '../panes/media/media3p/termsDialog';
import { renderWithTheme } from '../../../testUtils';

jest.mock('../../../utils/localStore', () => {
  const actual = jest.requireActual('../../../utils/localStore');
  return {
    ...actual,
    setItemByKey: jest.fn(),
    getItemByKey: jest.fn(() => false),
  };
});
import localStore, { LOCAL_STORAGE_PREFIX } from '../../../utils/localStore';

describe('TermsDialog', () => {
  it('should render', () => {
    const { queryByText } = renderWithTheme(<TermsDialog />);
    const link = queryByText(/^Learn more/);
    expect(link).toMatchSnapshot();
    expect(localStore.getItemByKey).toHaveBeenCalledWith(
      LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P
    );
  });
  it('should store the acknowledgement in the localStore when the window is dismissed', async () => {
    const { queryByText } = renderWithTheme(<TermsDialog />);
    const dismiss = queryByText(/^Dismiss/);
    expect(localStore.getItemByKey).toHaveBeenCalledWith(
      LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P
    );
    act(() => {
      fireEvent.click(dismiss);
    });
    await waitFor(() =>
      expect(localStore.setItemByKey).toHaveBeenCalledWith(
        LOCAL_STORAGE_PREFIX.TERMS_MEDIA3P,
        true
      )
    );
  });
});
