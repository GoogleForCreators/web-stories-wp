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
import media3pReducer from '../reducer';
import localReducer from '../../local/reducer';
import useMediaReducer from '../../useMediaReducer';
import * as media3pActionsToWrap from '../actions';
import * as localMediaActionsToWrap from '../../local/actions';
import * as types from '../../types';

describe('reducer', () => {
  let initialValue;

  beforeEach(() => {
    initialValue = media3pReducer(undefined, { type: types.INITIAL_STATE });
  });

  it('should provide initial state for each provider', () => {
    expect(initialValue).toStrictEqual(
      expect.objectContaining({ unsplash: expect.anything() })
    );
  });

  it('should reduce each provider state', () => {
    const { result } = renderHook(() =>
      useMediaReducer(media3pReducer, media3pActionsToWrap)
    );

    act(() => {
      result.current.actions.fetchMediaSuccess({
        provider: 'unsplash',
        media: [{ id: 'id' }],
      });
    });

    expect(result.current.state.unsplash).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        isMediaLoading: false,
      })
    );
  });

  it('should assign selectedProvider on setSelectedProvider', () => {
    const { result } = renderHook(() =>
      useMediaReducer(media3pReducer, media3pActionsToWrap)
    );

    act(() => {
      result.current.actions.setSelectedProvider({ provider: 'unsplash' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        selectedProvider: 'unsplash',
      })
    );
  });

  it('should assign searchTerm on setSearchTerm', () => {
    const { result } = renderHook(() =>
      useMediaReducer(media3pReducer, media3pActionsToWrap)
    );

    act(() => {
      result.current.actions.setSearchTerm({ searchTerm: 'cats' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        searchTerm: 'cats',
      })
    );
  });

  it('setting local search term does not affect media3p search term', () => {
    const { result: localMediaResult } = renderHook(() =>
      useMediaReducer(localReducer, localMediaActionsToWrap)
    );

    act(() => {
      localMediaResult.current.actions.setSearchTerm({ searchTerm: 'cats' });
    });

    const { result: media3pResult } = renderHook(() =>
      useMediaReducer(media3pReducer, media3pActionsToWrap)
    );

    expect(localMediaResult.current.state).toStrictEqual(
      expect.objectContaining({
        searchTerm: 'cats',
      })
    );
    expect(media3pResult.current.state).toStrictEqual(
      expect.objectContaining({
        searchTerm: '',
      })
    );
  });

  it('setting media3p search term does not affect local search term', () => {
    const { result: media3pResult } = renderHook(() =>
      useMediaReducer(media3pReducer, media3pActionsToWrap)
    );

    act(() => {
      media3pResult.current.actions.setSearchTerm({ searchTerm: 'cats' });
    });

    const { result: localMediaResult } = renderHook(() =>
      useMediaReducer(localReducer, localMediaActionsToWrap)
    );

    expect(media3pResult.current.state).toStrictEqual(
      expect.objectContaining({
        searchTerm: 'cats',
      })
    );

    expect(localMediaResult.current.state).toStrictEqual(
      expect.objectContaining({
        searchTerm: '',
      })
    );
  });
});
