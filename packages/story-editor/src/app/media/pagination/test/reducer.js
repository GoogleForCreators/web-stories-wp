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
import reducer from '../reducer';
import useMediaReducer from '../../useMediaReducer';
import * as commonActionsToWrap from '../actions';

describe('reducer', () => {
  it('should assign isMediaLoading=true on fetchMediaStart', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    result.current.actions.fetchMediaStart({
      provider: 'provider',
      pageToken: 'page2',
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
      useMediaReducer(reducer, commonActionsToWrap)
    );

    result.current.actions.fetchMediaSuccess({
      provider: 'provider',
      media: [{ id: 'id' }],
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        isMediaLoading: false,
      })
    );
  });

  it('should update state on fetchMediaSuccess', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    result.current.actions.fetchMediaSuccess({
      provider: 'provider',
      media: [{ id: 'id' }],
      nextPageToken: 'page2',
      totalPages: 10,
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        media: [{ id: 'id' }],
        pageToken: undefined,
        nextPageToken: 'page2',
        totalPages: 10,
        hasMore: true,
      })
    );
  });

  it('should append media if there is a pageToken fetchMediaSuccess', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    result.current.actions.fetchMediaSuccess({
      provider: 'provider',
      media: [{ id: 'id1' }],
      nextPageToken: 'page2',
      totalPages: 10,
    });

    result.current.actions.fetchMediaSuccess({
      provider: 'provider',
      media: [{ id: 'id2' }],
      pageToken: 'page2',
      nextPageToken: 'page3',
      totalPages: 10,
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        media: [{ id: 'id1' }, { id: 'id2' }],
        nextPageToken: 'page3',
        totalPages: 10,
        hasMore: true,
      })
    );
  });

  it("should replace media if there isn't a pageToken in fetchMediaSuccess", () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    result.current.actions.fetchMediaSuccess({
      media: [{ id: 'id1' }],
      nextPageToken: 'page2',
      totalPages: 10,
    });

    result.current.actions.fetchMediaSuccess({
      media: [{ id: 'id2' }],
      nextPageToken: 'page2',
      totalPages: 10,
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        media: [{ id: 'id2' }],
        nextPageToken: 'page2',
        totalPages: 10,
        hasMore: true,
      })
    );
  });

  it('should assign isMediaLoading=false on fetchMediaError', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    result.current.actions.fetchMediaError({ provider: 'provider' });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        isMediaLoading: false,
      })
    );
  });

  it('should update pageToken on setNextPage', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    result.current.actions.fetchMediaSuccess({
      provider: 'provider',
      media: [{ id: 'id' }],
      nextPageToken: 'page2',
    });

    result.current.actions.setNextPage({ provider: 'provider' });
    expect(result.current.state).toStrictEqual(
      expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page2' })
    );

    result.current.actions.fetchMediaSuccess({
      provider: 'provider',
      media: [{ id: 'id' }],
      nextPageToken: 'page3',
    });
    expect(result.current.state).toStrictEqual(
      expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page3' })
    );
  });
});
