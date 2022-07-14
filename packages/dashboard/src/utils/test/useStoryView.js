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
import useStoryView from '../useStoryView';
import {
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  STORY_STATUSES,
  VIEW_STYLE,
} from '../../constants';

describe('useStoryView()', function () {
  it('should have the default options initially selected', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 1 }),
      {}
    );

    expect(result.current.filter.value).toBe(STORY_STATUSES[0].value);
    expect(result.current.sort.value).toBe(STORY_SORT_OPTIONS.LAST_MODIFIED);
    expect(result.current.sort.direction).toBe(SORT_DIRECTION.DESC);
    expect(result.current.page.value).toBe(1);
  });

  it('should set the new filter when passed and reset the page.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    act(() => {
      result.current.page.requestNextPage();
    });
    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.filter.set(STORY_STATUSES[1].value);
    });
    expect(result.current.filter.value).toBe(STORY_STATUSES[1].value);
    expect(result.current.page.value).toBe(1);
  });

  it('should set the new sort when passed and reset the page.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    act(() => {
      result.current.page.requestNextPage();
    });
    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.sort.set(STORY_SORT_OPTIONS.NAME);
    });
    expect(result.current.sort.value).toBe(STORY_SORT_OPTIONS.NAME);
    expect(result.current.page.value).toBe(1);
  });

  it('should set the new filters when passed and reset the page.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    act(() => {
      result.current.page.requestNextPage();
    });
    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.filters.set({ web_story_category: 45 });
    });
    expect(result.current.filters.value).toMatchObject({
      web_story_category: 45,
    });
    expect(result.current.page.value).toBe(1);
  });

  it('should set the new search keyword when typed and reset the page.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    act(() => {
      result.current.page.requestNextPage();
    });
    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.search.setKeyword('Harry Potter Story');
    });
    expect(result.current.search.keyword).toBe('Harry Potter Story');
    expect(result.current.page.value).toBe(1);
  });

  it('should set the new view style when toggled.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    expect(result.current.view.style).toBe(VIEW_STYLE.GRID);

    act(() => {
      result.current.view.toggleStyle();
    });
    expect(result.current.view.style).toBe(VIEW_STYLE.LIST);
  });

  it('should set the sort direction to ASC when a NAME sort is selected and the view toggles to LIST.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    expect(result.current.view.style).toBe(VIEW_STYLE.GRID);
    expect(result.current.sort.direction).toBe(SORT_DIRECTION.DESC);

    act(() => {
      result.current.sort.set(STORY_SORT_OPTIONS.NAME);
    });
    act(() => {
      result.current.view.toggleStyle();
    });

    expect(result.current.view.style).toBe(VIEW_STYLE.LIST);
    expect(result.current.sort.value).toBe(STORY_SORT_OPTIONS.NAME);
    expect(result.current.sort.direction).toBe(SORT_DIRECTION.ASC);
  });

  it('should request the next page when called.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    act(() => {
      result.current.page.requestNextPage();
    });

    expect(result.current.page.value).toBe(2);
  });

  it('should request the next page when called and not exceed maximum pages.', function () {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    act(() => {
      result.current.page.requestNextPage();
    });

    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.page.requestNextPage();
    });

    expect(result.current.page.value).toBe(2);
  });

  it('should not show stories while loading by default', () => {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    expect(result.current.showStoriesWhileLoading.current).toBe(false);
  });

  it('should set showStoriesWhileLoading to true when next page is called', () => {
    const { result } = renderHook(
      () => useStoryView({ statusFilters: STORY_STATUSES, totalPages: 2 }),
      {}
    );

    act(() => {
      result.current.page.requestNextPage();
    });

    expect(result.current.showStoriesWhileLoading.current).toBe(true);
  });

  it('should reset showStoriesWhileLoading when `isLoading` is set to false', () => {
    let isLoading = true;
    const { result, rerender } = renderHook(
      () =>
        useStoryView({
          statusFilters: STORY_STATUSES,
          isLoading,
          totalPages: 2,
        }),
      {}
    );

    // set showStoriesWhileLoading to `true`
    act(() => {
      result.current.page.requestNextPage();
    });
    expect(result.current.showStoriesWhileLoading.current).toBe(true);

    isLoading = false;

    rerender();

    expect(result.current.showStoriesWhileLoading.current).toBe(false);
  });
});
