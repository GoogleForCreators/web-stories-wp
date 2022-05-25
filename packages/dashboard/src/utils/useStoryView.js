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
import { SORT_DIRECTION, STORY_SORT_OPTIONS, VIEW_STYLE } from '../constants';
import { PageSizePropType } from '../types';
import useFilters from '../app/views/myStories/filters/useFilters';
import usePagePreviewSize from './usePagePreviewSize';

export default function useStoryView({
  filters,
  isLoading = false,
  totalPages,
}) {
  const [viewStyle, setViewStyle] = useState(VIEW_STYLE.GRID);
  const [sort, _setSort] = useState(STORY_SORT_OPTIONS.LAST_MODIFIED);
  const [filter, _setFilter] = useState(
    filters.length > 0 ? filters[0].value : null
  );
  const [sortDirection, _setSortDirection] = useState(SORT_DIRECTION.DESC);
  const [page, setPage] = useState(1);
  const [searchKeyword, _setSearchKeyword] = useState('');
  const [authorFilterId, _setAuthorFilterId] = useState(null);
  const [queriedAuthors, setQueriedAuthors] = useState([]);
  const showStoriesWhileLoading = useRef(false);
  const [initialPageReady, setInitialPageReady] = useState(false);

  const { taxonomy } = useFilters(({ state: { taxonomy } }) => ({ taxonomy }));

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

  const setFilter = useCallback(
    (newFilter) => {
      _setFilter(newFilter);
      setPageClamped(1);
    },
    [setPageClamped]
  );

  const setSortDirection = useCallback(
    (newSortDirection) => {
      if (newSortDirection !== sortDirection) {
        _setSortDirection(newSortDirection);
      }
    },
    [sortDirection]
  );

  const toggleViewStyle = useCallback(() => {
    const newViewStyle =
      viewStyle === VIEW_STYLE.LIST ? VIEW_STYLE.GRID : VIEW_STYLE.LIST;

    setViewStyle(newViewStyle);

    if (newViewStyle === VIEW_STYLE.LIST) {
      const newSortDirection =
        sort === STORY_SORT_OPTIONS.NAME
          ? SORT_DIRECTION.ASC
          : SORT_DIRECTION.DESC;

      setSortDirection(newSortDirection);
    }
  }, [sort, setSortDirection, viewStyle, setViewStyle]);

  const setSearchKeyword = useCallback(
    (newSearchKeyword) => {
      setPageClamped(1);
      _setSearchKeyword(newSearchKeyword);
    },
    [setPageClamped]
  );

  const requestNextPage = useCallback(() => {
    showStoriesWhileLoading.current = true;
    setPageClamped(page + 1);
  }, [page, setPageClamped]);

  const toggleAuthorFilterId = useCallback(({ id }) => {
    _setAuthorFilterId((prevFilterId) => (prevFilterId === id ? null : id));
  }, []);

  useEffect(() => {
    if (searchKeyword.length) {
      trackEvent('search', {
        search_type: 'dashboard_stories',
        search_term: searchKeyword,
        search_filter: filter,
        search_author_filter: authorFilterId,
        search_taxonomy_filter: taxonomy.filterId,
        search_order: sortDirection,
        search_orderby: sort,
        search_view: viewStyle,
      });
    }
  }, [
    searchKeyword,
    filter,
    sortDirection,
    sort,
    viewStyle,
    authorFilterId,
    taxonomy.filterId,
  ]);

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

  return useMemo(
    () => ({
      view: {
        style: viewStyle,
        toggleStyle: toggleViewStyle,
        pageSize,
      },
      sort: {
        value: sort,
        direction: sortDirection,
        set: setSort,
        setDirection: setSortDirection,
      },
      filter: {
        value: filter,
        set: setFilter,
      },
      page: {
        value: page,
        set: setPage,
        requestNextPage,
      },
      search: {
        keyword: searchKeyword,
        setKeyword: setSearchKeyword,
      },
      author: {
        filterId: authorFilterId,
        toggleFilterId: toggleAuthorFilterId,
        queriedAuthors,
        setQueriedAuthors,
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
      sortDirection,
      setSortDirection,
      filter,
      initialPageReady,
      setFilter,
      page,
      requestNextPage,
      searchKeyword,
      setSearchKeyword,
      authorFilterId,
      toggleAuthorFilterId,
      queriedAuthors,
      setQueriedAuthors,
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
