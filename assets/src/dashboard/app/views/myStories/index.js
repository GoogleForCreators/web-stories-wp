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
import { useContext, useEffect, useMemo } from 'react';

/**
 * Internal dependencies
 */
import { ScrollToTop, Layout } from '../../../components';
import { VIEW_STYLE, STORY_STATUSES } from '../../../constants';
import { useStoryView } from '../../../utils';
import { ApiContext } from '../../api/apiProvider';
import { useConfig } from '../../config';
import Content from './content';
import Header from './header';

function MyStories() {
  const {
    actions: {
      storyApi: { duplicateStory, fetchStories, trashStory, updateStory },
      templateApi: { createTemplateFromStory },
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
      users,
    },
  } = useContext(ApiContext);

  const { filter, page, search, sort, view } = useStoryView({
    filters: STORY_STATUSES,
    totalPages,
  });

  const { wpListURL } = useConfig();

  useEffect(() => {
    fetchStories({
      page: page.value,
      searchTerm: search.keyword,
      sortDirection: view.style === VIEW_STYLE.LIST && sort.direction,
      sortOption: sort.value,
      status: filter.value,
    });
  }, [
    fetchStories,
    filter.value,
    page.value,
    search.keyword,
    sort.direction,
    sort.value,
    view.style,
  ]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  return (
    <Layout.Provider>
      <Header
        filter={filter}
        search={search}
        sort={sort}
        stories={orderedStories}
        totalStoriesByStatus={totalStoriesByStatus}
        view={view}
        wpListURL={wpListURL}
      />

      <Content
        allPagesFetched={allPagesFetched}
        filter={filter}
        isLoading={isLoading}
        page={page}
        search={search}
        sort={sort}
        stories={orderedStories}
        storyActions={{
          createTemplateFromStory,
          duplicateStory,
          trashStory,
          updateStory,
        }}
        users={users}
        view={view}
      />

      <Layout.Fixed>
        <ScrollToTop />
      </Layout.Fixed>
    </Layout.Provider>
  );
}

export default MyStories;
