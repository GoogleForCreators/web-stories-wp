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
import { createContext, useCallback, useMemo, useReducer } from 'react';
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
  ITEMS_PER_PAGE,
  STORY_STATUSES,
  STORY_SORT_OPTIONS,
  ORDER_BY_SORT,
} from '../../constants';
import getAllTemplates from '../../templates';
import storyReducer, {
  ACTION_TYPES as STORY_ACTION_TYPES,
} from './reducer/stories';

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

export function reshapeTemplateObject({ id, title, pages }) {
  return {
    id,
    title,
    status: 'template',
    modified: moment('2020-04-07'),
    pages,
    centerTargetAction: '',
    bottomTargetAction: () => {},
  };
}

export default function ApiProvider({ children }) {
  const { api, editStoryURL, pluginDir } = useConfig();
  const [state, dispatch] = useReducer(storyReducer, {
    stories: {},
    totalStories: null,
    totalPages: null,
  });

  const templates = useMemo(
    () => getAllTemplates({ pluginDir }).map(reshapeTemplateObject),
    [pluginDir]
  );

  const fetchStories = useCallback(
    async ({
      orderby = STORY_SORT_OPTIONS.LAST_MODIFIED,
      page = 1,
      searchTerm,
      status = STORY_STATUSES[0].value,
    }) => {
      if (!api.stories) {
        return [];
      }

      const query = {
        context: 'edit',
        order: ORDER_BY_SORT[orderby],
        orderby,
        page,
        per_page: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
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
        const totalStories = parseInt(response.headers.get('X-WP-Total'));
        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_TOTAL_STORIES_COUNT,
          payload: { totalStories },
        });

        const totalPages = parseInt(response.headers.get('X-WP-TotalPages'));
        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_TOTAL_STORIES_PAGES,
          payload: { totalPages },
        });

        const serverStoryResponse = await response.json();
        const reshapedStories = serverStoryResponse
          .map(reshapeStoryObject(editStoryURL))
          .filter(Boolean);

        dispatch({
          type: STORY_ACTION_TYPES.UPDATE_STORIES,
          payload: reshapedStories,
        });

        return reshapedStories;
      } catch (err) {
        return [];
      }
    },
    [api.stories, editStoryURL]
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
        stories: state.stories,
        totalStories: state.totalStories,
        totalPages: state.totalPages,
        templates,
      },
      actions: { fetchStories, getAllFonts },
    }),
    [
      templates,
      fetchStories,
      getAllFonts,
      state.stories,
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
