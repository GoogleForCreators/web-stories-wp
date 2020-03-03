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
import Fill from '../fill';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Panels/Fill', () => {
  it('should render <Fill /> panel', () => {
    const { getByText } = arrange(
      <Fill
        selectedElements={[{ isFill: false }]}
        onSetProperties={() => null}
      />,
      {
        actions: { setBackgroundElement: () => null },
      }
    );

    const element = getByText('Set as fill');

    expect(element).toBeDefined();
  });

  it('should simulate a click on <Fill />', () => {
    const onClickOnSetPropertiesMock = jest.fn();

    const { getByText } = arrange(
      <Fill
        selectedElements={[{ isFill: false }]}
        onSetProperties={onClickOnSetPropertiesMock}
      />
    );

    const element = getByText('Set as fill');

    fireEvent.click(element);

    expect(onClickOnSetPropertiesMock).toHaveBeenCalledTimes(1);
    expect(element.textContent).toStrictEqual('Unset as fill');
  });
});
