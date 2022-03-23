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
import { screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { renderWithTheme } from '@googleforcreators/test-utils';

/**
 * Internal dependencies
 */
import theme from '../../../../theme';
import ColorPicker from '../..';

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
  const getEditableHexElement = () => screen.getByLabelText(/edit hex/i);
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
  const getSwatchList = (name) => screen.queryByRole('listbox', { name });
  const getSwatches = (list) =>
    within(getSwatchList(list)).getAllByRole('option');
  const getEnabledSwatches = (list) =>
    within(getSwatchList(list))
      .getAllByRole('option')
      .filter(
        (e) => !e.hasAttribute('disabled') && !e.hasAttribute('aria-disabled')
      );
  const getSwatchByLabel = (list, name) =>
    within(getSwatchList(list)).getByRole('option', { name });
  const getSelectedSwatch = (list) =>
    within(getSwatchList(list)).queryByRole('option', {
      selected: true,
    });
  const getCustomButton = () => screen.getByRole('button', { name: 'Custom' });
  const getAddCustomButton = () =>
    screen.getByRole('button', { name: 'Add to Saved Colors' });
  const getBackButton = () => screen.getByRole('button', { name: 'Go back' });
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
    getSwatchList,
    getEnabledSwatches,
    getSwatches,
    getSwatchByLabel,
    getSelectedSwatch,
    getCustomButton,
    getAddCustomButton,
    getBackButton,
    onChange,
    onClose,
    rerender: wrapperRerender,
  };
}

export { arrange };
