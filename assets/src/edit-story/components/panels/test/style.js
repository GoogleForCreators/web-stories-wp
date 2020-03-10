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
import createSolid from '../../../utils/createSolid';
import Style from '../style';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Panels/Style', () => {
  it('should render <Style /> panel', () => {
    const { getByLabelText } = arrange(
      <Style
        selectedElements={[{ backgroundColor: createSolid(255, 255, 255) }]}
        onSetProperties={() => null}
      />
    );

    const element = getByLabelText(/Background color/);
    expect(element).toBeDefined();
    // TODO: Actually verify that the element label is 'Background color: FFFFFF'
  });
});
