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
import { fireEvent, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../../theme';
import ColorPicker from '../..';
import { renderWithTheme } from '../../../../testUtils';

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
  const view = renderWithTheme(<ColorPicker {...props} />);
  const { rerender } = view;
  const getDialog = () => screen.getByRole('dialog');
  const getSolidButton = () => screen.queryByLabelText(/solid pattern/i);
  const getLinearButton = () =>
    screen.queryByLabelText(/linear gradient pattern/i);
  const getRadialButton = () =>
    screen.queryByLabelText(/radial gradient pattern/i);
  const getCloseButton = () => screen.queryByLabelText(/close/i);
  const getEditableHexElement = () => screen.queryByLabelText(/edit hex/i);
  const getEditableAlphaElement = () =>
    screen.queryByLabelText(/edit opacity/i);
  const getGradientLine = () => screen.queryByLabelText(/gradient line/i);
  const getGradientStops = () =>
    screen.queryAllByLabelText(/^gradient stop at/i);
  // The gradient line is reversed, so we deduct the value from 100.
  const getGradientStopAt = (pct) =>
    screen.queryByLabelText(new RegExp(`gradient stop at ${100 - pct}%`, 'i'));
  const getTempGradientStop = () =>
    screen.queryByLabelText(/temporary gradient stop/i);
  const getGradientReverse = () =>
    screen.queryByLabelText(/reverse gradient stops/i);
  const getGradientRotate = () => screen.queryByLabelText(/rotate gradient/i);
  const wrapperRerender = (moreCustomProps) =>
    rerender(
      <ThemeProvider theme={theme}>
        <ColorPicker {...props} {...moreCustomProps} />
      </ThemeProvider>
    );
  return {
    ...view,
    getDialog,
    getSolidButton,
    getLinearButton,
    getRadialButton,
    getCloseButton,
    getEditableHexElement,
    getEditableAlphaElement,
    getGradientLine,
    getGradientStops,
    getGradientStopAt,
    getTempGradientStop,
    getGradientReverse,
    getGradientRotate,
    onChange,
    onClose,
    rerender: wrapperRerender,
  };
}

function firePointerEvent(node, eventType, properties) {
  fireEvent(node, new window.MouseEvent(eventType, properties));
}

const pointerEventTypes = [
  'pointerOver',
  'pointerEnter',
  'pointerDown',
  'pointerMove',
  'pointerUp',
  'pointerCancel',
  'pointerOut',
  'pointerLeave',
  'gotPointerCapture',
  'lostPointerCapture',
];

pointerEventTypes.forEach((type) => {
  firePointerEvent[type] = (node, properties) =>
    firePointerEvent(node, type.toLowerCase(), {
      bubbles: true,
      ...properties,
    });
});

export { getResolvingPromise, arrange, firePointerEvent };
