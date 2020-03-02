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
import TextStyle from '../textStyle';
import { APIProvider } from '../../../app/api';
import { FontProvider } from '../../../app/font';

function arrange(children = null) {
  return render(
    <ThemeProvider theme={theme}>
      <APIProvider>
        <FontProvider
          value={{
            state: { fonts: [{ name: 'Font A', value: 'font-a' }] },
            actions: { getFontWeight: jest.fn(), getFontFallback: jest.fn() },
          }}
        >
          {children}
        </FontProvider>
      </APIProvider>
    </ThemeProvider>
  );
}

describe('Panels/TextStyle', () => {
  it('should render <TextStyle /> panel', () => {
    const { getByText } = arrange(
      <TextStyle
        selectedElements={[
          {
            textAlign: 'normal',
            fontSize: 0,
            padding: 0,
            fontFamily: 'Font A',
          },
        ]}
        onSetProperties={() => null}
      />
    );

    const element = getByText('Style');

    expect(element).toBeDefined();
  });

  it('should simulate a submit on <TextStyle /> panel', () => {
    const onClickOnSetPropertiesMock = jest.fn();

    const { getByText } = arrange(
      <TextStyle
        selectedElements={[
          {
            textAlign: 'normal',
            fontSize: 0,
            padding: 0,
            fontFamily: 'Font A',
          },
        ]}
        onSetProperties={onClickOnSetPropertiesMock}
      />
    );

    const element = getByText('Style');

    fireEvent.submit(element.parentNode.parentNode.nextSibling);

    expect(onClickOnSetPropertiesMock).toHaveBeenCalledTimes(1);
  });
});
