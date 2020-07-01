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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import reducer from '../reducer';
import useMediaReducer from '../../useMediaReducer';
import * as actionsToWrap from '../../actions';

describe('reducer', () => {
  it('should assign isMediaLoading=true on fetchMediaStart', async () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, actionsToWrap)
    );

    await act(() =>
      result.current.actions.fetchMediaStart({ pageToken: 'page2' })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoading: true,
        isMediaLoaded: false,
      })
    );
  });

  it('should assign isMediaLoading=false on fetchMediaSuccess', async () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, actionsToWrap)
    );

    await act(() =>
      result.current.actions.fetchMediaSuccess({ media: [{ id: 'id' }] })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        isMediaLoading: false,
      })
    );
  });

  it('should update state on fetchMediaSuccess', async () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, actionsToWrap)
    );

    await act(() =>
      result.current.actions.fetchMediaSuccess({
        media: [{ id: 'id' }],
        nextPageToken: 'page2',
        totalPages: 10,
      })
    );

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

  it('should assign isMediaLoading=false on fetchMediaError', async () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, actionsToWrap)
    );

    await act(() => result.current.actions.fetchMediaError());

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        isMediaLoading: false,
      })
    );
  });

  it('should update pageToken on setNextPage', async () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, actionsToWrap)
    );

    await act(() =>
      result.current.actions.fetchMediaSuccess({
        media: [{ id: 'id' }],
        nextPageToken: 'page2',
      })
    );

    await act(() => result.current.actions.setNextPage());
    expect(result.current.state).toStrictEqual(
      expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page2' })
    );

    await act(() =>
      result.current.actions.fetchMediaSuccess({
        media: [{ id: 'id' }],
        nextPageToken: 'page3',
      })
    );
    expect(result.current.state).toStrictEqual(
      expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page3' })
    );
  });
});
