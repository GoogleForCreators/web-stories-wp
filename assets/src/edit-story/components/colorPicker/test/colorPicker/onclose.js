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
import { waitFor, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { arrange, getResolvingPromise } from './_utils';

describe('<ColorPicker /> as it closes', () => {
  it('should invoke onclose and restore focus when pressing "escape"', async () => {
    // Body has focus before the test runs. Make sure body is re-focusable
    document.body.tabIndex = 0;
    expect(document.body).toHaveFocus();

    const { getDialog, onClose } = arrange();
    expect(document.body).not.toHaveFocus();
    const dialog = getDialog();

    // press escape and wait for onClose to be invoked
    await waitFor(() => {
      const promise = getResolvingPromise(onClose);
      fireEvent.keyDown(dialog, { key: 'Escape', which: 27 });
      return promise;
    });

    expect(onClose).toHaveBeenCalledWith(expect.anything());
    await waitFor(() => expect(document.body).toHaveFocus());
  });

  it('should invoke onclose and restore focus when clicking close button', async () => {
    // Body has focus before the test runs. Make sure body is re-focusable
    document.body.tabIndex = 0;
    expect(document.body).toHaveFocus();

    const { getCloseButton, onClose } = arrange();
    expect(document.body).not.toHaveFocus();
    const closeButton = getCloseButton();

    // click close button and wait for onClose to be invoked
    await waitFor(() => {
      const promise = getResolvingPromise(onClose);
      fireEvent.click(closeButton);
      return promise;
    });

    expect(onClose).toHaveBeenCalledWith(expect.anything());
    await waitFor(() => expect(document.body).toHaveFocus());
  });
});
