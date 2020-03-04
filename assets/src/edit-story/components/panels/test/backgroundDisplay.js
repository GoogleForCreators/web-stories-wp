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
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import BackgroundDisplayPanel from '../backgroundDisplay.js';

function setupPanel(isFullbleedBackground = undefined) {
  const selectedElements = [{ isFullbleedBackground }];
  const onSetProperties = jest.fn();
  const { getByRole } = render(
    <ThemeProvider theme={theme}>
      <BackgroundDisplayPanel
        onSetProperties={onSetProperties}
        selectedElements={selectedElements}
      />
    </ThemeProvider>
  );
  const element = getByRole('combobox');
  return {
    element,
    onSetProperties,
  };
}

describe('BackgroundDisplayPanel', () => {
  it('should display a dropdown with the default value', () => {
    const { element } = setupPanel();
    expect(element.value).toStrictEqual('yes');
  });

  it('should select other option if disabled', () => {
    const { element } = setupPanel(false);
    expect(element.value).toStrictEqual('no');
  });

  it('should disable fullbleed', () => {
    const { element, onSetProperties } = setupPanel(true);

    fireEvent.change(element, { target: { value: 'no' } });

    expect(onSetProperties).toHaveBeenCalledWith({
      isFullbleedBackground: false,
    });
  });

  it('should enable fullbleed', () => {
    const { element, onSetProperties } = setupPanel(false);

    fireEvent.change(element, { target: { value: 'yes' } });

    expect(onSetProperties).toHaveBeenCalledWith({
      isFullbleedBackground: true,
    });
  });
});
