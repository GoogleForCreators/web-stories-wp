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
import { act, renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import providerReducer from '../providerReducer';
import useMediaReducer from '../../useMediaReducer';
import * as actionsToWrap from '../actions';
import * as paginationActionsToWrap from '../../pagination/actions';
import * as categoryActionsToWrap from '../categories/actions';

describe('providerReducer', () => {
  it('should assign isMediaLoading=true on fetchMediaStart', () => {
    const { result } = renderHook(() =>
      useMediaReducer(providerReducer, actionsToWrap)
    );

    act(() => {
      result.current.actions.fetchMediaStart({
        provider: 'unsplash',
        pageToken: 'page2',
      });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoading: true,
        isMediaLoaded: false,
      })
    );
  });

  it('should reset {next}pageToken when the search term changes', () => {
    const { result } = renderHook(() =>
      useMediaReducer(providerReducer, {
        ...actionsToWrap,
        ...paginationActionsToWrap,
      })
    );

    act(() => {
      result.current.actions.fetchMediaSuccess({
        provider: 'provider',
        media: [{ id: 'id' }],
        nextPageToken: 'page2',
      });
    });

    act(() => {
      result.current.actions.setNextPage({ provider: 'provider' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: true,
        pageToken: 'page2',
        nextPageToken: 'page2',
      })
    );

    act(() => {
      result.current.actions.setSearchTerm({ searchTerm: 'lala' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isMediaLoaded: false,
        pageToken: undefined,
        nextPageToken: undefined,
      })
    );
  });

  it('should reset {next}pageToken when the selected category changes', () => {
    const { result } = renderHook(() =>
      useMediaReducer(providerReducer, {
        ...actionsToWrap,
        ...paginationActionsToWrap,
        ...categoryActionsToWrap,
      })
    );

    act(() => {
      result.current.actions.fetchMediaSuccess({
        provider: 'provider',
        media: [{ id: 'id' }],
        nextPageToken: 'page2',
      });
    });

    act(() => {
      result.current.actions.setNextPage({ provider: 'provider' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page2' })
    );

    act(() => {
      result.current.actions.selectCategory({ categoryId: 'lala' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        pageToken: undefined,
        nextPageToken: undefined,
      })
    );
  });

  it('should reset {next}pageToken when the category is deselected', () => {
    const { result } = renderHook(() =>
      useMediaReducer(providerReducer, {
        ...actionsToWrap,
        ...paginationActionsToWrap,
        ...categoryActionsToWrap,
      })
    );

    act(() => {
      result.current.actions.fetchMediaSuccess({
        provider: 'provider',
        media: [{ id: 'id' }],
        nextPageToken: 'page2',
      });
    });

    act(() => {
      result.current.actions.setNextPage({ provider: 'provider' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page2' })
    );

    act(() => {
      result.current.actions.deselectCategory({ categoryId: 'lala' });
    });

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        pageToken: undefined,
        nextPageToken: undefined,
      })
    );
  });
});
