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
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useReducer,
} from 'react';
import moment from 'moment';
import queryString from 'query-string';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import {
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  ORDER_BY_SORT,
  APP_ROUTES,
  ITEMS_PER_PAGE,
} from '../../constants';
import getAllTemplates from '../../templates';
import storyReducer, {
  defaultStoriesState,
  ACTION_TYPES as STORY_ACTION_TYPES,
} from '../reducer/stories';

export const ApiContext = createContext({ state: {}, actions: {} });

export function reshapeStoryObject(editStoryURL) {
  return function ({ id, title, modified, status, story_data: storyData }) {
    if (
      !Array.isArray(storyData.pages) ||
      !id ||
      storyData.pages.length === 0
    ) {
      return null;
    }
    return {
      id,
      status,
      title: title.rendered,
      modified: moment(modified),
      pages: storyData.pages,
      centerTargetAction: '',
      bottomTargetAction: `${editStoryURL}&post=${id}`,
    };
  };
}

export function reshapeTemplateObject({
  id,
  title,
  tags,
  colors,
  createdBy,
  description,
  pages,
}) {
  return {
    id,
    title,
    createdBy,
    description,
    status: 'template',
    modified: moment('2020-04-07'),
    metadata: [...tags, ...colors].map((value) =>
      typeof value === 'object' ? { ...value } : { label: value }
    ),
    pages,
    centerTargetAction: `#${APP_ROUTES.TEMPLATE_DETAIL}?id=${id}`,
    bottomTargetAction: () => {},
  };
}

export default function ApiProvider({ children }) {
  const { api, editStoryURL, pluginDir } = useConfig();
  const [state, dispatch] = useReducer(storyReducer, defaultStoriesState);

  const [templates, setTemplates] = useState([]);

  const fetchStories = useCallback(
    async ({
      status = STORY_STATUSES[0].value,
      sortOption = STORY_SORT_OPTIONS.LAST_MODIFIED,
      sortDirection,
      searchTerm,
      page = 1,
      perPage = ITEMS_PER_PAGE,
    }) => {
      // dispatch({
      //   type: STORY_ACTION_TYPES.LOADING_STORIES,
      //   payload: true,
      // });

      if (!api.stories) {
        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
          payload: true,
        });
        return [];
      }

      const query = {
        context: 'edit',
        search: searchTerm || undefined,
        orderby: sortOption,
        page,
        per_page: perPage,
        order: sortDirection || ORDER_BY_SORT[sortOption],
        status,
      };

      try {
        const path = queryString.stringifyUrl({
          url: api.stories,
          query,
        });

        const response = await apiFetch({
          path,
          parse: false,
        });

        // TODO add headers for totals by status and have header reflect search
        // only update totals when data is different
        const totalStories = parseInt(response.headers.get('X-WP-Total'));

        const totalPages = parseInt(response.headers.get('X-WP-TotalPages'));

        const serverStoryResponse = await response.json();

        const reshapedStories = serverStoryResponse
          .map(reshapeStoryObject(editStoryURL))
          .filter(Boolean);

        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_SUCCESS,
          payload: {
            stories: reshapedStories,
            totalPages,
            totalStories,
            page,
          },
        });

        return reshapedStories;
      } catch (err) {
        dispatch({
          type: STORY_ACTION_TYPES.FETCH_STORIES_FAILURE,
          payload: true,
        });
        return [];
      }
      // finally {
      //   dispatch({
      //     type: STORY_ACTION_TYPES.LOADING_STORIES,
      //     payload: false,
      //   });
      // }
    },
    [api.stories, editStoryURL]
  );

  const fetchTemplates = useCallback(() => {
    const reshapedTemplates = getAllTemplates({ pluginDir }).map(
      reshapeTemplateObject
    );
    setTemplates(reshapedTemplates);

    return Promise.resolve(reshapedTemplates);
  }, [pluginDir]);

  const fetchTemplate = useCallback(
    async (id) => {
      const fetchedTemplates = await fetchTemplates();
      return Promise.resolve(
        fetchedTemplates.find((template) => template.id === id)
      );
    },
    [fetchTemplates]
  );

  const getAllFonts = useCallback(() => {
    if (!api.fonts) {
      return Promise.resolve([]);
    }

    return apiFetch({ path: api.fonts }).then((data) =>
      data.map((font) => ({
        value: font.name,
        ...font,
      }))
    );
  }, [api.fonts]);

  const value = useMemo(
    () => ({
      state: {
        allPagesFetched: state.allPagesFetched,
        isLoading: state.isLoading,
        stories: state.stories,
        storiesOrderById: state.storiesOrderById,
        totalStories: state.totalStories,
        totalPages: state.totalPages,
        templates,
      },
      actions: {
        fetchStories,
        fetchTemplates,
        fetchTemplate,
        getAllFonts,
      },
    }),
    [
      templates,
      fetchStories,
      fetchTemplates,
      fetchTemplate,
      getAllFonts,
      state.allPagesFetched,
      state.isLoading,
      state.stories,
      state.storiesOrderById,
      state.totalStories,
      state.totalPages,
    ]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

ApiProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
