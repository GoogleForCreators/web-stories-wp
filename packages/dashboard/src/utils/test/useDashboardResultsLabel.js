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
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import {
  DASHBOARD_VIEWS,
  RESULT_LABELS,
  STORY_STATUS,
  TEMPLATES_GALLERY_STATUS,
} from '../../constants';

import useDashboardResultsLabel from '../useDashboardResultsLabel';

describe('useGenericResultsLabel()', function () {
  it(`should return an empty string to display if there is no currentFilter supplied`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          currentFilter: null,
          view: DASHBOARD_VIEWS.DASHBOARD,
        }),
      {}
    );
    expect(result.current).toBe('');
  });

  // Dashboard
  it(`should have default options initially selected for ${DASHBOARD_VIEWS.DASHBOARD}`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          currentFilter: STORY_STATUS.ALL,
          view: DASHBOARD_VIEWS.DASHBOARD,
        }),
      {}
    );
    expect(result.current).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.DASHBOARD][STORY_STATUS.ALL](0)
    );
  });

  it(`should have options selected for ${DASHBOARD_VIEWS.DASHBOARD} when filtered to drafts`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          currentFilter: STORY_STATUS.DRAFT,
          view: DASHBOARD_VIEWS.DASHBOARD,
        }),
      {}
    );
    expect(result.current).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.DASHBOARD][STORY_STATUS.DRAFT](0)
    );
  });

  it(`should have options selected for ${DASHBOARD_VIEWS.DASHBOARD} when filtered to published stories`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          currentFilter: STORY_STATUS.PUBLISH,
          view: DASHBOARD_VIEWS.DASHBOARD,
        }),
      {}
    );
    expect(result.current).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.DASHBOARD][STORY_STATUS.PUBLISH](0)
    );
  });

  it(`should show counted results if isActiveSearch is true for ${DASHBOARD_VIEWS.DASHBOARD}`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          isActiveSearch: true,
          totalResults: 4,
          currentFilter: STORY_STATUS.PUBLISH,
          view: DASHBOARD_VIEWS.DASHBOARD,
        }),
      {}
    );
    expect(result.current).toBe('<strong>4</strong> results');
  });

  it(`should show "1 result" if isActiveSearch is true and totalResults is 0 for ${DASHBOARD_VIEWS.DASHBOARD}`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          isActiveSearch: true,
          totalResults: 1,
          currentFilter: STORY_STATUS.PUBLISH,
          view: DASHBOARD_VIEWS.DASHBOARD,
        }),
      {}
    );
    expect(result.current).toBe('<strong>1</strong> result');
  });

  it(`should show "0 results" if isActiveSearch is true and totalResults is 0 for ${DASHBOARD_VIEWS.DASHBOARD}`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          isActiveSearch: true,
          totalResults: 0,
          currentFilter: STORY_STATUS.PUBLISH,
          view: DASHBOARD_VIEWS.DASHBOARD,
        }),
      {}
    );
    expect(result.current).toBe('<strong>0</strong> results');
  });

  // template gallery

  it(`should have default options initially selected for ${DASHBOARD_VIEWS.TEMPLATES_GALLERY}`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          currentFilter: TEMPLATES_GALLERY_STATUS.ALL,
          view: DASHBOARD_VIEWS.TEMPLATES_GALLERY,
        }),
      {}
    );
    expect(result.current).toBe(
      RESULT_LABELS[DASHBOARD_VIEWS.TEMPLATES_GALLERY][
        TEMPLATES_GALLERY_STATUS.ALL
      ](0)
    );
  });

  it(`should show counted results if isActiveSearch is true for ${DASHBOARD_VIEWS.TEMPLATES_GALLERY}`, function () {
    const { result } = renderHook(
      () =>
        useDashboardResultsLabel({
          isActiveSearch: true,
          totalResults: 41,
          currentFilter: TEMPLATES_GALLERY_STATUS.ALL,
          view: DASHBOARD_VIEWS.TEMPLATES_GALLERY,
        }),
      {}
    );
    expect(result.current).toBe('<strong>41</strong> results');
  });
});
