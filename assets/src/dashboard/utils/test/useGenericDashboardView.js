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
import {
  DASHBOARD_VIEWS,
  RESULT_LABELS,
  SAVED_TEMPLATES_STATUS,
  STORY_STATUS,
  TEMPLATES_GALLERY_STATUS,
} from '../../constants';

import useGenericDashboardView from '../useGenericDashboardView';

describe('useGenericGDashboardView()', function () {
  // my stories
  it(`should have default options initially selected for ${DASHBOARD_VIEWS.MY_STORIES}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          currentFilter: STORY_STATUS.ALL,
          view: DASHBOARD_VIEWS.MY_STORIES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.MY_STORIES][STORY_STATUS.ALL]
    );
  });

  it(`should have options selected for ${DASHBOARD_VIEWS.MY_STORIES} when filtered to drafts`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          currentFilter: STORY_STATUS.DRAFT,
          view: DASHBOARD_VIEWS.MY_STORIES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.MY_STORIES][STORY_STATUS.DRAFT]
    );
  });

  it(`should have options selected for ${DASHBOARD_VIEWS.MY_STORIES} when filtered to published stories`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          currentFilter: STORY_STATUS.PUBLISHED,
          view: DASHBOARD_VIEWS.MY_STORIES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.MY_STORIES][STORY_STATUS.PUBLISHED]
    );
  });

  it(`should show counted results if isActiveSearch is true for ${DASHBOARD_VIEWS.MY_STORIES}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          isActiveSearch: true,
          totalResults: 4,
          currentFilter: STORY_STATUS.PUBLISHED,
          view: DASHBOARD_VIEWS.MY_STORIES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe('4 results');
  });

  it(`should show "1 result" if isActiveSearch is true and totalResults is 0 for ${DASHBOARD_VIEWS.MY_STORIES}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          isActiveSearch: true,
          totalResults: 1,
          currentFilter: STORY_STATUS.PUBLISHED,
          view: DASHBOARD_VIEWS.MY_STORIES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe('1 result');
  });

  it(`should show "0 results" if isActiveSearch is true and totalResults is 0 for ${DASHBOARD_VIEWS.MY_STORIES}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          isActiveSearch: true,
          totalResults: 0,
          currentFilter: STORY_STATUS.PUBLISHED,
          view: DASHBOARD_VIEWS.MY_STORIES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe('0 results');
  });

  // saved templates
  it(`should have default options initially selected for ${DASHBOARD_VIEWS.SAVED_TEMPLATES}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          currentFilter: SAVED_TEMPLATES_STATUS.ALL,
          view: DASHBOARD_VIEWS.SAVED_TEMPLATES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.SAVED_TEMPLATES][SAVED_TEMPLATES_STATUS.ALL]
    );
  });

  it(`should have options selected for ${DASHBOARD_VIEWS.SAVED_TEMPLATES} when filtered to current user`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          currentFilter: SAVED_TEMPLATES_STATUS.CURRENT_USER,
          view: DASHBOARD_VIEWS.SAVED_TEMPLATES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.SAVED_TEMPLATES][
        SAVED_TEMPLATES_STATUS.CURRENT_USER
      ]
    );
  });

  it(`should have options selected for ${DASHBOARD_VIEWS.SAVED_TEMPLATES} when filtered to bookmarked templates`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          currentFilter: SAVED_TEMPLATES_STATUS.BOOKMARKED,
          view: DASHBOARD_VIEWS.SAVED_TEMPLATES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.SAVED_TEMPLATES][
        SAVED_TEMPLATES_STATUS.BOOKMARKED
      ]
    );
  });

  it(`should show counted results if isActiveSearch is true for ${DASHBOARD_VIEWS.SAVED_TEMPLATES}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          isActiveSearch: true,
          totalResults: 30,
          currentFilter: SAVED_TEMPLATES_STATUS.BOOKMARKED,
          view: DASHBOARD_VIEWS.SAVED_TEMPLATES,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe('30 results');
  });

  // template gallery

  it(`should have default options initially selected for ${DASHBOARD_VIEWS.TEMPLATES_GALLERY}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          currentFilter: TEMPLATES_GALLERY_STATUS.ALL,
          view: DASHBOARD_VIEWS.TEMPLATES_GALLERY,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.TEMPLATES_GALLERY][
        TEMPLATES_GALLERY_STATUS.ALL
      ]
    );
  });

  it(`should show counted results if isActiveSearch is true for ${DASHBOARD_VIEWS.TEMPLATES_GALLERY}`, function () {
    const { result } = renderHook(
      () =>
        useGenericDashboardView({
          isActiveSearch: true,
          totalResults: 41,
          currentFilter: TEMPLATES_GALLERY_STATUS.ALL,
          view: DASHBOARD_VIEWS.TEMPLATES_GALLERY,
        }),
      {}
    );
    expect(result.current.header.resultsLabel).toBe('41 results');
  });
});
