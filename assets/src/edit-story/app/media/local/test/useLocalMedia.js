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
import useLocalMedia from '../useLocalMedia';
import MediaContext from '../../../../app/media/context';

describe('useLocalMedia', () => {
  function renderUseLocalMedia(mediaContextValue, selector) {
    const wrapper = (params) => (
      <MediaContext.Provider value={mediaContextValue}>
        {params.children}
      </MediaContext.Provider>
    );

    const { result } = renderHook(() => useLocalMedia(selector), { wrapper });
    return result.current;
  }

  it('should return state for local media', () => {
    const state = renderUseLocalMedia({
      local: {
        sampleLocalState1: 'value1',
        sampleLocalState2: 'value2',
      },
    });
    expect(state).toStrictEqual({
      sampleLocalState1: 'value1',
      sampleLocalState2: 'value2',
    });
  });

  it('should return state for local media when using a selector', () => {
    const state = renderUseLocalMedia(
      {
        local: {
          sampleLocalState1: 'value1',
          sampleLocalState2: 'value2',
        },
      },
      ({ sampleLocalState2 }) => ({ sampleLocalState2 })
    );
    expect(state).toStrictEqual({
      sampleLocalState2: 'value2',
    });
  });
});
