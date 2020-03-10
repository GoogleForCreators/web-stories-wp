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
import { render, wait, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import ColorPicker from '../';

function getResolvingPromise(mock) {
  return new Promise((resolve) => {
    mock.mockImplementationOnce(() => {
      resolve();
    });
  });
}

function arrange(customProps = {}) {
  const onChange = jest.fn();
  const onClose = jest.fn();
  const props = {
    onChange,
    onClose,
    ...customProps,
  };
  const accessors = render(
    <ThemeProvider theme={theme}>
      <ColorPicker {...props} />
    </ThemeProvider>
  );
  const { getByRole, queryByLabelText } = accessors;
  const dialog = getByRole('dialog');
  const solidButton = queryByLabelText(/Solid pattern/);
  const closeButton = queryByLabelText(/Close/);
  return {
    ...accessors,
    dialog,
    solidButton,
    closeButton,
    onChange,
    onClose,
  };
}

describe('<ColorPicker />', () => {
  it('should render with initial focus forced to the solid pattern button', () => {
    const { solidButton } = arrange();

    expect(solidButton).toBeInTheDocument();
    expect(solidButton).toHaveFocus();
  });

  it('should invoke onclose and restore focus when pressing "escape"', async () => {
    // Body has focus before the test runs. Make sure body is re-focusable
    document.body.tabIndex = 0;
    expect(document.body).toHaveFocus();

    const { closeButton, onClose } = arrange();
    expect(document.body).not.toHaveFocus();

    // press escape and wait for onClose to be invoked
    await wait(() => {
      const promise = getResolvingPromise(onClose);
      fireEvent.keyDown(closeButton, { key: 'Escape', which: 27 });
      return promise;
    });

    expect(onClose).toHaveBeenCalledWith();
    await wait(() => expect(document.body).toHaveFocus());
  });

  it('should invoke onclose and restore focus when clicking close button', async () => {
    // Body has focus before the test runs. Make sure body is re-focusable
    document.body.tabIndex = 0;
    expect(document.body).toHaveFocus();

    const { closeButton, onClose } = arrange();
    expect(document.body).not.toHaveFocus();

    // press escape and wait for onClose to be invoked
    await wait(() => {
      const promise = getResolvingPromise(onClose);
      fireEvent.click(closeButton);
      return promise;
    });

    expect(onClose).toHaveBeenCalledWith();
    await wait(() => expect(document.body).toHaveFocus());
  });
});
