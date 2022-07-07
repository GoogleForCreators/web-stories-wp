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
import { useCallback, useMemo, useState } from '@googleforcreators/react';
import { clamp } from '@googleforcreators/units';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import {
  TEMPLATES_GALLERY_SORT_OPTIONS,
  VIEW_STYLE,
  DEFAULT_TEMPLATE_FILTERS,
} from '../constants';
import { PageSizePropType } from '../types';
import usePagePreviewSize from './usePagePreviewSize';

export default function useTemplateView({
  totalPages,
  sortObject = DEFAULT_TEMPLATE_FILTERS.sort,
  filtersObject = DEFAULT_TEMPLATE_FILTERS.filters,
}) {
  const [sort, _setSort] = useState(sortObject);
  const [filters, _setFilters] = useState(filtersObject);
  const [page, setPage] = useState(1);

  const { pageSize } = usePagePreviewSize({
    isGrid: true,
  });

  const setPageClamped = useCallback(
    (newPage) => {
      const pageRange = { MIN: 1, MAX: totalPages };
      setPage(clamp(newPage, pageRange));
    },
    [totalPages]
  );
  const requestNextPage = useCallback(
    () => setPageClamped(page + 1),
    [page, setPageClamped]
  );

  const setSort = useCallback(
    (newSort) => {
      _setSort(newSort);
      setPageClamped(1);
    },
    [setPageClamped]
  );

  const setFilters = useCallback(
    (newSort) => {
      _setFilters(newSort);
      setPageClamped(1);
    },
    [setPageClamped]
  );

  return useMemo(
    () => ({
      view: {
        style: VIEW_STYLE.GRID,
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
    }),
    [pageSize, sort, setSort, page, requestNextPage, filters, setFilters]
  );
}

export const ViewPropTypes = PropTypes.shape({
  style: PropTypes.oneOf(Object.values(VIEW_STYLE)),
  pageSize: PageSizePropType,
});

export const FilterPropTypes = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  set: PropTypes.func,
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

export const SortPropTypes = PropTypes.shape({
  value: PropTypes.oneOf(Object.values(TEMPLATES_GALLERY_SORT_OPTIONS)),
  set: PropTypes.func,
});
