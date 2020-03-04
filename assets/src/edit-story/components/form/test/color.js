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
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import { Color } from '../';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Form/Color', () => {
  it('should render <Color /> form', () => {
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    const { getByTestId } = arrange(
      <Color
        value="#000000"
        isMultiple={false}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        data-testid="color"
      />
    );

    const input = getByTestId('color');

    expect(input).toBeDefined();
  });
  // TODO: More tests should be defined as soon as we start https://github.com/google/web-stories-wp/issues/378
});
