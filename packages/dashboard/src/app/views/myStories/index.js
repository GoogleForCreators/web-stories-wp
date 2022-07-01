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
  const { filtersObject, sortObject } = useFilters(
    ({ state: { filtersObject, sortObject } }) => ({
      filtersObject,
      sortObject,
    })
  );

  const { apiCallbacks, canViewDefaultTemplates } = useConfig();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const { page, view, showStoriesWhileLoading, initialPageReady } =
    useStoryView({
      filtersObject,
      sortObject,
      isLoading,
      totalPages,
    });

  useEffect(() => {
    fetchStories({
      page: page.value,
      filters: filtersObject,
      sort: sortObject,
    });
  }, [fetchStories, filtersObject, sortObject, page.value, apiCallbacks]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  return (
    <Layout.Provider>
      <Header
        initialPageReady={initialPageReady}
        stories={orderedStories}
        totalStoriesByStatus={totalStoriesByStatus}
        view={view}
      />

      <Content
        allPagesFetched={allPagesFetched}
        canViewDefaultTemplates={canViewDefaultTemplates}
        filtersObject={filtersObject}
        loading={{
          isLoading: isLoading,
          showStoriesWhileLoading,
        }}
        page={page}
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
