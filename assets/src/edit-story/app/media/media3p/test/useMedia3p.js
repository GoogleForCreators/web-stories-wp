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
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import MediaContext from '../../../../app/media/context';
import { useMedia3p, useMedia3pForProvider } from '../useMedia3p';

describe('useMedia3p', () => {
  function renderUseMedia3p(mediaContextValue, selector) {
    return renderUseMedia3pForProvider(undefined, mediaContextValue, selector);
  }

  function renderUseMedia3pForProvider(provider, mediaContextValue, selector) {
    const wrapper = (params) => (
      <MediaContext.Provider value={mediaContextValue}>
        {params.children}
      </MediaContext.Provider>
    );

    const { result } = renderHook(
      () =>
        provider
          ? useMedia3pForProvider(provider, selector)
          : useMedia3p(selector),
      { wrapper }
    );
    return result.current;
  }

  it('should return state for media3p', () => {
    const state = renderUseMedia3p(
      {
        media3p: {
          sampleMedia3pState1: 'value1',
          sampleMedia3pState2: 'value2',
        },
      },
      ({ sampleMedia3pState2 }) => ({ sampleMedia3pState2 })
    );
    expect(state).toStrictEqual({
      sampleMedia3pState2: 'value2',
    });
  });

  it('should return state for media3p provider', () => {
    const state = renderUseMedia3pForProvider(
      'unsplash',
      {
        media3p: {
          unsplash: {
            sampleProviderState1: 'value1',
            sampleProviderState2: 'value2',
          },
        },
      },
      ({ sampleProviderState2 }) => ({ sampleProviderState2 })
    );
    expect(state).toStrictEqual({
      sampleProviderState2: 'value2',
    });
  });
});
