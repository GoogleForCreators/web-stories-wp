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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { trackEvent } from '@googleforcreators/tracking';
import { clamp } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import {
  DEFAULT_FILTERS,
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  VIEW_STYLE,
} from '../constants';
import { PageSizePropType } from '../types';
import usePagePreviewSize from './usePagePreviewSize';

export default function useStoryView({
  filtersObject = DEFAULT_FILTERS.filters,
  sortObject = DEFAULT_FILTERS.sort,
  isLoading = false,
  totalPages,
}) {
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const [sort, _setSort] = useState(sortObject);
  const [filters, _setFilters] = useState(filtersObject);
  const [page, setPage] = useState(1);
  const showStoriesWhileLoading = useRef(false);
  const [initialPageReady, setInitialPageReady] = useState(false);

  const { pageSize } = usePagePreviewSize({
    thumbnailMode: viewStyle === VIEW_STYLE.LIST,
    isGrid: viewStyle === VIEW_STYLE.GRID,
  });

  const setPageClamped = useCallback(
    (newPage) => {
      const pageRange = { MIN: 1, MAX: totalPages };
      setPage(clamp(newPage, pageRange));
    },
    [totalPages]
  );

  const setSort = useCallback(
    (newSort) => {
      _setSort(newSort);
      setPageClamped(1);
    },
    [setPageClamped]
  );

  const setFilters = useCallback(
    (newFilters) => {
      _setFilters(newFilters);
      setPageClamped(1);
    },
    [setPageClamped]
  );

  const toggleViewStyle = useCallback(() => {
    const newViewStyle =
      viewStyle === VIEW_STYLE.LIST ? VIEW_STYLE.GRID : VIEW_STYLE.LIST;

    setViewStyle(newViewStyle);
  }, [viewStyle, setViewStyle]);

  const requestNextPage = useCallback(() => {
    showStoriesWhileLoading.current = true;
    setPageClamped(page + 1);
  }, [page, setPageClamped]);

  useEffect(() => {
    if (filters?.search?.length) {
      trackEvent('search', {
        search_type: 'dashboard_stories',
        search_term: filters.search,
        search_filter: filters.status,
        search_author_filter: filters.author,
        search_order: sort.order,
        search_orderby: sort.orderby,
        search_view: viewStyle,
      });
    }
  }, [filters, sort, viewStyle]);

  useEffect(() => {
    // reset ref state after request is finished
    if (!isLoading) {
      showStoriesWhileLoading.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    // give views a way to prevent early excess renders by waiting until data's ready
    if (totalPages && !initialPageReady) {
      setInitialPageReady(true);
    }
  }, [totalPages, initialPageReady]);

  useEffect(() => {
    if (initialPageReady) {
      setFilters(filtersObject);
    }
  }, [setFilters, initialPageReady, filtersObject]);

  useEffect(() => {
    if (initialPageReady) {
      setSort(sortObject);
    }
  }, [setSort, initialPageReady, sortObject]);

  return useMemo(
    () => ({
      view: {
        style: viewStyle,
        toggleStyle: toggleViewStyle,
        pageSize,
      },
      sort: {
        value: sort.orderby,
        direction: sort.order,
        set: setSort,
      },
      filters: {
        value: filters,
        set: setFilters,
      },
      page: {
        value: page,
        set: setPage,
        requestNextPage,
      },
      initialPageReady,
      showStoriesWhileLoading,
    }),
    [
      viewStyle,
      toggleViewStyle,
      pageSize,
      sort,
      setSort,
      filters,
      setFilters,
      initialPageReady,
      page,
      requestNextPage,
    ]
  );
}

export const ViewPropTypes = PropTypes.shape({
  style: PropTypes.oneOf(Object.values(VIEW_STYLE)),
  toggleStyle: PropTypes.func,
  pageSize: PageSizePropType,
});

export const AuthorPropTypes = PropTypes.shape({
  filterId: PropTypes.number,
  toggleFilterId: PropTypes.func,
  queriedAuthors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ).isRequired,
  setQueriedAuthors: PropTypes.func,
});

export const FilterPropTypes = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  set: PropTypes.func,
});

export const SortPropTypes = PropTypes.shape({
  value: PropTypes.oneOf(Object.values(STORY_SORT_OPTIONS)),
  set: PropTypes.func,
  direction: PropTypes.oneOf(Object.values(SORT_DIRECTION)),
  setDirection: PropTypes.func,
});

export const PagePropTypes = PropTypes.shape({
  value: PropTypes.number,
  set: PropTypes.func,
  requestNextPage: PropTypes.func,
});

export const SearchPropTypes = PropTypes.shape({
  keyword: PropTypes.string,
  setKeyword: PropTypes.func,
});

export const ShowStoriesWhileLoadingPropType = PropTypes.shape({
  current: PropTypes.bool,
});
