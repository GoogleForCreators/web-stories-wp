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
    getTaxonomies,
    getTaxonomyTerm,
  } = useApi(
    ({
      actions: {
        storyApi: { duplicateStory, fetchStories, trashStory, updateStory },
        usersApi: { getAuthors },
        taxonomyApi: { getTaxonomies, getTaxonomyTerm },
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
      getTaxonomies,
      getTaxonomyTerm,
    })
  );
  const { apiCallbacks, canViewDefaultTemplates } = useConfig();
  const isMounted = useRef(false);
  const taxonomies = useRef([]);

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
    taxonomy,
  } = useStoryView({
    filters: STORY_STATUSES,
    isLoading,
    totalPages,
  });

  const { setQueriedAuthors } = author;
  // TODO: rename this to be queryHierarchicalTaxonomiesBySearch
  const { setQueriedTaxonomies } = taxonomy;
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

  const fetchTaxonomies = useCallback(
    async (taxonomiesData, search) => {
      const toFetch = taxonomiesData.filter((t) => Boolean(t?.hierarchical));
      const promises = toFetch.map(
        (t) =>
          new Promise((res) => getTaxonomyTerm(t.url, { search }).then(res))
      );
      const data = await Promise.all(promises);

      const extraction = [];
      for (const arr of data) {
        extraction.push(
          ...arr.map((t) => ({ id: t.id, name: t.name, taxonomy: t.taxonomy }))
        );
      }
      return extraction;
    },
    [getTaxonomyTerm]
  );

  // TODO: rename this to be queryHierarchicalTaxonomiesBySearch
  let queryTaxonomiesBySearch = useCallback(
    // TODO: In progress for the open PR of #11426
    // Status: We're fetching data for taxonomies
    // However, we need the actual data of taxonomies
    // And we need to filter out things that aren't hierarchical
    // That's the next step here - Sam
    (search) => {
      if (!isMounted.current) {
        return;
      }

      const taxonomyData = taxonomies.current.map(
        ({ name, slug, hierarchical, restPath }) => ({
          name,
          slug,
          hierarchical,
          url: restPath,
        })
      );

      return fetchTaxonomies(taxonomyData, search).then((data) => {
        setQueriedTaxonomies((current) => {
          const existing = current.map((t) => ({
            id: t.id,
            taxonomy: t.taxonomy,
          }));
          const newTaxonomies = data.filter((t) => {
            return !existing.find(
              (e) => e.id === t.id && e.taxonomy === t.taxonomy
            );
          });
          return [...current, ...newTaxonomies];
        });
      });
    },
    [setQueriedTaxonomies, taxonomies.current]
  );

  if (!getAuthors) {
    queryAuthorsBySearch = noop;
  }

  if (!getTaxonomies) {
    queryTaxonomiesBySearch = noop;
  }

  useEffect(() => {
    queryAuthorsBySearch();
  }, [queryAuthorsBySearch]);

  useEffect(() => {
    const getTaxonomiesData = async () => {
      taxonomies.current = await getTaxonomies();
      queryTaxonomiesBySearch();
    };
    if (!taxonomies.current.length) {
      getTaxonomiesData();
    } else {
      queryTaxonomiesBySearch();
    }
  }, [getTaxonomies, fetchTaxonomies, queryTaxonomiesBySearch]);

  useEffect(() => {
    fetchStories({
      page: page.value,
      searchTerm: search.keyword,
      sortDirection: sort.direction,
      sortOption: sort.value,
      status: filter.value,
      author: author.filterId,
      taxonomy: { id: taxonomy.filterId, slug: taxonomy.filterSlug },
    });
  }, [
    fetchStories,
    filter.value,
    page.value,
    search.keyword,
    sort.direction,
    sort.value,
    author.filterId,
    taxonomy.filterId,
    taxonomy.filterSlug,
    apiCallbacks,
  ]);

  const orderedStories = useMemo(() => {
    return storiesOrderById.map((storyId) => {
      return stories[storyId];
    });
  }, [stories, storiesOrderById]);

  const showAuthorDropdown = typeof getAuthors === 'function';
  const showTaxonomyDropdown = typeof getTaxonomies === 'function';

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
        taxonomy={taxonomy}
        queryAuthorsBySearch={queryAuthorsBySearch}
        queryTaxonomiesBySearch={queryTaxonomiesBySearch}
        showAuthorDropdown={showAuthorDropdown}
        showTaxonomyDropdown={showTaxonomyDropdown}
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
