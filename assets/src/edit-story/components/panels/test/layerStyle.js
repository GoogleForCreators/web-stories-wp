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
import LayerStyle from '../layerStyle';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Panels/LayerStyle', () => {
  let pushUpdate;

  beforeEach(() => {
    pushUpdate = jest.fn();
  });

  it('should render <LayerStyle /> panel', () => {
    const { getByText } = arrange(
      <LayerStyle
        selectedElements={[{ opacity: 100 }]}
        pushUpdate={pushUpdate}
      />
    );

    const element = getByText('Layer');
    expect(element).toBeDefined();
  });

  it('should set opacity to 100 if not set', () => {
    const { getByText } = arrange(
      <LayerStyle selectedElements={[{}]} pushUpdate={pushUpdate} />
    );

    const element = getByText('Opacity');
    const input = element.getElementsByTagName('input')[0];
    expect(input.value).toStrictEqual('100%');
  });

  it('should set opacity to 100 if set to 0', () => {
    const { getByText } = arrange(
      <LayerStyle selectedElements={[{ opacity: 0 }]} pushUpdate={pushUpdate} />
    );

    const element = getByText('Opacity');
    const input = element.getElementsByTagName('input')[0];
    expect(input.value).toStrictEqual('100%');
  });

  it('should set opacity to 49 if set to 49', () => {
    const { getByText } = arrange(
      <LayerStyle
        selectedElements={[{ opacity: 49 }]}
        pushUpdate={pushUpdate}
      />
    );

    const element = getByText('Opacity');
    const input = element.getElementsByTagName('input')[0];
    expect(input.value).toStrictEqual('49%');
  });

  it('should update opacity value on change', () => {
    const { getByText } = arrange(
      <LayerStyle
        selectedElements={[{ opacity: 49 }]}
        pushUpdate={pushUpdate}
      />
    );

    const element = getByText('Opacity');
    const input = element.getElementsByTagName('input')[0];
    fireEvent.change(input, { target: { value: '23' } });
    expect(pushUpdate).toHaveBeenCalledWith({ opacity: 23 });
  });
});
