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
import useTemplateView from '../useTemplateView';
import {
  TEMPLATES_GALLERY_STATUS,
  TEMPLATES_GALLERY_SORT_OPTIONS,
} from '../../constants';

describe('useTemplateView()', function () {
  it('should have the default options initially selected', function () {
    const { result } = renderHook(() => useTemplateView({ totalPages: 1 }), {});

    expect(result.current.filter.value).toBe(TEMPLATES_GALLERY_STATUS.ALL);
    expect(result.current.sort.value).toBe(
      TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR
    );
    expect(result.current.page.value).toBe(1);
    expect(result.current.search.keyword).toBe('');
  });

  it('should set the new sort when passed and reset the page.', function () {
    const { result } = renderHook(() => useTemplateView({ totalPages: 2 }), {});

    act(() => {
      result.current.page.requestNextPage();
    });
    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.sort.set(TEMPLATES_GALLERY_SORT_OPTIONS.RECENT);
    });
    expect(result.current.sort.value).toBe(
      TEMPLATES_GALLERY_SORT_OPTIONS.RECENT
    );
    expect(result.current.page.value).toBe(1);
  });

  it('should set the new search keyword when typed and reset the page.', function () {
    const { result } = renderHook(() => useTemplateView({ totalPages: 2 }), {});

    act(() => {
      result.current.page.requestNextPage();
    });
    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.search.setKeyword('Magical Creatures Template');
    });
    expect(result.current.search.keyword).toBe('Magical Creatures Template');
    expect(result.current.page.value).toBe(1);
  });

  it('should request the next page when called.', function () {
    const { result } = renderHook(() => useTemplateView({ totalPages: 2 }), {});

    act(() => {
      result.current.page.requestNextPage();
    });

    expect(result.current.page.value).toBe(2);
  });

  it('should request the next page when called and not exceed maximum pages.', function () {
    const { result } = renderHook(() => useTemplateView({ totalPages: 2 }), {});

    act(() => {
      result.current.page.requestNextPage();
    });

    expect(result.current.page.value).toBe(2);

    act(() => {
      result.current.page.requestNextPage();
    });

    expect(result.current.page.value).toBe(2);
  });
});
