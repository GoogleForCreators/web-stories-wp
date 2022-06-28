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
import { useEffect, useMemo, useRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { ScrollToTop, Layout } from '../../../components';
import { STORY_STATUSES } from '../../../constants';
import { useStoryView } from '../../../utils';
import { useConfig } from '../../config';
import useApi from '../../api/useApi';
import useFilters from './filters/useFilters';
import Content from './content';
import Header from './header';

function MyStories() {
  const {
    duplicateStory,
    fetchStories,
    trashStory,
    updateStory,
    allPagesFetched,
    isLoading,
    stories,
    storiesOrderById,
    totalPages,
    totalStoriesByStatus,
  } = useApi(
    ({
      actions: {
        storyApi: { duplicateStory, fetchStories, trashStory, updateStory },
      },
      state: {
        stories: {
          allPagesFetched,
          isLoading,
          stories,
          storiesOrderById,
          totalPages,
          totalStoriesByStatus,
        },
      },
    }) => ({
      duplicateStory,
      fetchStories,
      trashStory,
      updateStory,
      allPagesFetched,
      isLoading,
      stories,
      storiesOrderById,
      totalPages,
      totalStoriesByStatus,
    })
  );
  const { filtersObject } = useFilters(({ state: { filtersObject } }) => ({
    filtersObject,
  }));

  const { apiCallbacks, canViewDefaultTemplates } = useConfig();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const {
    page,
    search,
    sort,
    view,
    showStoriesWhileLoading,
    initialPageReady,
  } = useStoryView({
    statusFilters: STORY_STATUSES,
    filtersObject,
    isLoading,
    totalPages,
  });

  useEffect(() => {
    fetchStories({
      page: page.value,
      searchTerm: search.keyword,
      sortDirection: sort.direction,
      sortOption: sort.value,
      filters: filtersObject,
    });
  }, [
    fetchStories,
    filtersObject,
    page.value,
    search.keyword,
    sort.direction,
    sort.value,
    apiCallbacks,
  ]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  return (
    <Layout.Provider>
      <Header
        initialPageReady={initialPageReady}
        search={search}
        sort={sort}
        stories={orderedStories}
        totalStoriesByStatus={totalStoriesByStatus}
        view={view}
      />

      <Content
        allPagesFetched={allPagesFetched}
        canViewDefaultTemplates={canViewDefaultTemplates}
        filter={filtersObject.status}
        filtersObject={filtersObject}
        loading={{
          isLoading: isLoading,
          showStoriesWhileLoading,
        }}
        page={page}
        search={search}
        sort={sort}
        stories={orderedStories}
        storyActions={{
          duplicateStory,
          trashStory,
          updateStory,
        }}
        view={view}
      />

      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
    </Layout.Provider>
  );
}

export default MyStories;
