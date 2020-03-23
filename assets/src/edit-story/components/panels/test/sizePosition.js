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
import SizePosition from '../sizePosition';
import { getDefinitionForType } from '../../../elements';

jest.mock('../../../elements');

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Panels/SizePosition', () => {
  let pushUpdate;
  let pushUpdateForObject;

  beforeEach(() => {
    pushUpdate = jest.fn();
    pushUpdateForObject = jest.fn();
    getDefinitionForType.mockImplementation((type) => {
      return {
        isMedia: 'image' === type,
      };
    });
  });

  it('should render <SizePosition /> panel', () => {
    const { getByText } = arrange(
      <SizePosition
        selectedElements={[
          {
            flip: {
              vertical: false,
              horizontal: false,
            },
            isBackground: false,
            width: 100,
            height: 100,
            isFill: false,
            rotationAngle: 0,
          },
        ]}
        pushUpdate={pushUpdate}
        pushUpdateForObject={pushUpdateForObject}
      />,
      {
        actions: { setBackgroundElement: () => null },
      }
    );

    const element = getByText('Size & position');

    expect(element).toBeDefined();
  });

  it('should render Background button for Image', () => {
    const { getByText } = arrange(
      <SizePosition
        selectedElements={[
          {
            flip: {
              vertical: false,
              horizontal: false,
            },
            isBackground: false,
            width: 100,
            height: 100,
            isFill: false,
            rotationAngle: 0,
            type: 'image',
          },
        ]}
        pushUpdate={pushUpdate}
        pushUpdateForObject={pushUpdateForObject}
      />,
      {
        actions: { setBackgroundElement: () => null },
      }
    );

    const element = getByText('Set as background');

    expect(element).toBeDefined();
  });

  // QQQQ: lots of tests
});
