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
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { ScrollToTop, Layout } from '../../../components';
import { STORY_STATUSES } from '../../../constants';
import { useStoryView, noop } from '../../../utils';
import useApi from '../../api/useApi';
import { useConfig } from '../../config';
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
    getAuthors,
  } = useApi(
    ({
      actions: {
        storyApi: { duplicateStory, fetchStories, trashStory, updateStory },
        usersApi: { getAuthors },
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
      getAuthors,
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

  const {
    filter,
    page,
    search,
    sort,
    view,
    showStoriesWhileLoading,
    initialPageReady,
    author,
  } = useStoryView({
    filters: STORY_STATUSES,
    isLoading,
    totalPages,
  });

  const { setQueriedAuthors } = author;
  let queryAuthorsBySearch = useCallback(
    (authorSearchTerm) => {
      return getAuthors(authorSearchTerm).then((data) => {
        if (!isMounted.current) {
          return;
        }

        const userData = data.map(({ id, name }) => ({
          id,
          name,
        }));
        setQueriedAuthors((existingUsers) => {
          const existingUsersIds = existingUsers.map(({ id }) => id);
          const newUsers = userData.filter(
            (newUser) => !existingUsersIds.includes(newUser.id)
          );
          return [...existingUsers, ...newUsers];
        });
      });
    },
    [getAuthors, setQueriedAuthors]
  );

  if (!getAuthors) {
    queryAuthorsBySearch = noop;
  }

  useEffect(() => {
    queryAuthorsBySearch();
  }, [queryAuthorsBySearch]);

  useEffect(() => {
    fetchStories({
      page: page.value,
      searchTerm: search.keyword,
      sortDirection: sort.direction,
      sortOption: sort.value,
      status: filter.value,
      author: author.filterId,
    });
  }, [
    fetchStories,
    filter.value,
    page.value,
    search.keyword,
    sort.direction,
    sort.value,
    author.filterId,
    apiCallbacks,
  ]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const showAuthorDropdown = typeof getAuthors === 'function';

  return (
    <Layout.Provider>
      <Header
        initialPageReady={initialPageReady}
        filter={filter}
        search={search}
        sort={sort}
        stories={orderedStories}
        totalStoriesByStatus={totalStoriesByStatus}
        view={view}
        author={author}
        queryAuthorsBySearch={queryAuthorsBySearch}
        showAuthorDropdown={showAuthorDropdown}
      />

      <Content
        allPagesFetched={allPagesFetched}
        canViewDefaultTemplates={canViewDefaultTemplates}
        filter={filter}
        loading={{ isLoading, showStoriesWhileLoading }}
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
