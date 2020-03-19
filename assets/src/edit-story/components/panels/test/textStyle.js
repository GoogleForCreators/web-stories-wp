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
import { render, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import TextStyle from '../textStyle';
import { APIProvider } from '../../../app/api';
import { ConfigProvider } from '../../../app/config';
import { FontProvider } from '../../../app/font';

function arrange(children = null) {
  return render(
    <ThemeProvider theme={theme}>
      <ConfigProvider
        config={{
          api: { fonts: '/amp/v1/fonts' },
        }}
      >
        <APIProvider
          value={{
            actions: { getAllFonts: jest.fn() },
          }}
        >
          <FontProvider
            value={{
              state: { fonts: [{ name: 'ABeeZee', value: 'ABeeZee' }] },
              actions: { getFontWeight: jest.fn(), getFontFallback: jest.fn() },
            }}
          >
            {children}
          </FontProvider>
        </APIProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}

describe('Panels/TextStyle', () => {
  beforeEach(() => {
    global.fetch.resetMocks();
  });

  it('should render <TextStyle /> panel', async () => {
    let container;

    await act(async () => {
      await global.fetch
        .doMockIf(/^\/amp\/v1\/fonts/)
        .mockResponse(JSON.stringify([{ name: 'ABeeZee', value: 'ABeeZee' }]), {
          status: 200,
        });

      container = arrange(
        <TextStyle
          selectedElements={[
            {
              textAlign: 'normal',
              fontSize: 0,
              padding: {
                horizontal: 0,
                vertical: 0,
              },
              fontFamily: 'ABeeZee',
            },
          ]}
          onSetProperties={() => null}
        />
      );
    });

    const { getByText } = container;

    const element = getByText('Style');

    expect(element).toBeDefined();
  });
});
