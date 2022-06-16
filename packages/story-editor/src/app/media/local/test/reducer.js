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
import { renderHook, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import useMediaReducer from '../../useMediaReducer';
import reducer from '../reducer';
import * as localActionsToWrap from '../actions';
import { fetchMediaStart as commonFetchMediaStart } from '../../pagination/actions';

describe('reducer', () => {
  it('should not update for media action that`s not for local media', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, { ...localActionsToWrap, commonFetchMediaStart })
    );

    act(() => {
      result.current.actions.commonFetchMediaStart({
        provider: 'unsplash',
        pageToken: 'page2',
      });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoading: false,
        isMediaLoaded: false,
      })
    );
  });

  it('should assign isMediaLoading=true on fetchMediaStart', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, localActionsToWrap)
    );

    act(() => {
      result.current.actions.fetchMediaStart({ pageToken: 'page2' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoading: true,
        isMediaLoaded: false,
      })
    );
  });

  it('should assign isMediaLoaded=true on fetchMediaSuccess', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, localActionsToWrap)
    );

    act(() => {
      result.current.actions.fetchMediaSuccess({
        media: [{ id: 'id' }],
        searchTerm: '',
        mediaType: '',
      });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        isMediaLoading: false,
      })
    );
  });

  it('should not update state on fetchMediaSuccess if searchTerm doesn`t match', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, localActionsToWrap)
    );

    act(() => {
      result.current.actions.setSearchTerm({ searchTerm: 'search term 1' });
    });

    act(() => {
      result.current.actions.fetchMediaSuccess({
        searchTerm: 'search term 2',
        media: [{ id: 'id' }],
      });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        searchTerm: 'search term 1',
        media: [],
        nextPageToken: undefined,
      })
    );
  });

  it('should not update state on fetchMediaSuccess if mediaType doesn`t match', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, localActionsToWrap)
    );

    act(() => {
      result.current.actions.setMediaType({ mediaType: 'image' });
    });

    act(() => {
      result.current.actions.fetchMediaSuccess({
        mediaType: 'video',
        media: [{ id: 'id' }],
      });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        mediaType: 'image',
        media: [],
        nextPageToken: undefined,
      })
    );
  });
});
