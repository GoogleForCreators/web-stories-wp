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
import useMediaReducer from '../../../useMediaReducer';
import * as commonActionsToWrap from '../actions';

describe('reducer', () => {
  it('should assign isLoading=true on fetchCategoriesStart', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    act(() =>
      result.current.actions.fetchCategoriesStart({ provider: 'unsplash' })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isLoading: true,
        isLoaded: false,
      })
    );
  });

  it('should assign isLoaded=true on fetchCategoriesSuccess', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    act(() =>
      result.current.actions.fetchCategoriesSuccess({
        provider: 'unsplash',
        categories: [
          {
            name: 'categories/unsplash:c7USHrQ0Ljw',
            label: 'COVID-19',
          },
        ],
      })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isLoaded: true,
        isLoading: false,
      })
    );
  });

  it('should update state on fetchCategoriesSuccess', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    act(() =>
      result.current.actions.fetchCategoriesSuccess({
        provider: 'unsplash',
        categories: [
          {
            name: 'categories/unsplash:c7USHrQ0Ljw',
            label: 'COVID-19',
          },
        ],
      })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        categories: [
          {
            name: 'categories/unsplash:c7USHrQ0Ljw',
            label: 'COVID-19',
          },
        ],
      })
    );
  });

  it('should assign isLoading=false on fetchCategoriesError', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    act(() =>
      result.current.actions.fetchCategoriesError({ provider: 'unsplash' })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        isLoaded: true,
        isLoading: false,
      })
    );
  });

  it('should assign category on selectCategory', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    act(() =>
      result.current.actions.selectCategory({
        provider: 'unsplash',
        categoryId: 'categories/unsplash:1',
      })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        selectedCategoryId: 'categories/unsplash:1',
      })
    );
  });

  it('should unassign category on deselectCategory', () => {
    const { result } = renderHook(() =>
      useMediaReducer(reducer, commonActionsToWrap)
    );

    act(() =>
      result.current.actions.deselectCategory({ provider: 'unsplash' })
    );

    expect(result.current.state).toStrictEqual(
      expect.objectContaining({
        selectedCategoryId: undefined,
      })
    );
  });
});
