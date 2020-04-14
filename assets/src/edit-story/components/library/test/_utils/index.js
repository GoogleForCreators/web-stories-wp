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
import theme from '../../../../theme';
import Library from '../../index';
import { MediaProvider } from '../../../../app/media';
import { ConfigProvider } from '../../../../app/config';
import { FontProvider } from '../../../../app/font';
import APIContext from '../../../../app/api/context';

export async function arrange({ mediaResponse = [] }) {
  const config = {
    api: {},
    allowedMimeTypes: {
      image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      video: ['video/mp4'],
    },
  };
  const getMediaPromise = Promise.resolve({
    data: mediaResponse,
    headers: { get: () => 1 },
  });
  const getAllFontsPromise = Promise.resolve([]);
  const allPromises = [getMediaPromise, getAllFontsPromise];
  const apiContextValue = {
    actions: {
      getMedia: () => getMediaPromise,
      getAllFonts: () => getAllFontsPromise,
    },
  };

  const accessors = render(
    <ThemeProvider theme={theme}>
      <ConfigProvider config={config}>
        <APIContext.Provider value={apiContextValue}>
          <FontProvider>
            <MediaProvider>
              <Library />
            </MediaProvider>
          </FontProvider>
        </APIContext.Provider>
      </ConfigProvider>
    </ThemeProvider>
  );

  // Another option without allPromises:
  // const flushPromises = () => new Promise(window.setImmediate);
  // await act(flushPromises);

  await act(() => Promise.all(allPromises));

  return accessors;
}
