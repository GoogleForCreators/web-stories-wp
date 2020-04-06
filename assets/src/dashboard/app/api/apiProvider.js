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
import { createContext, useCallback, useMemo, useState } from 'react';
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
import { STORY_STATUSES } from '../../constants';

export const ApiContext = createContext({ state: {}, actions: {} });

export function reshapeStoryObject(editStoryURL) {
  return function ({ id, title, modified, status, story_data: storyData }) {
    return {
      id,
      status,
      title: title.rendered,
      modified: moment(modified),
      pages: storyData.pages,
      editStoryUrl: `${editStoryURL}&post=${id}`,
    };
  };
}

export default function ApiProvider({ children }) {
  const { api, editStoryURL } = useConfig();
  const [stories, setStories] = useState([]);

  const fetchStories = useCallback(
    async ({ status = STORY_STATUSES[0].value }) => {
      try {
        const path = queryString.stringifyUrl({
          url: api.stories,
          query: { status, context: 'edit' },
        });
        const serverStoryResponse = await apiFetch({
          path,
        });
        const reshapedStories = serverStoryResponse.map(
          reshapeStoryObject(editStoryURL)
        );
        setStories(reshapedStories);
        return reshapedStories;
      } catch (err) {
        return [];
      }
    },
    [api.stories, editStoryURL]
  );

  const getAllFonts = useCallback(() => {
    return apiFetch({ path: api.fonts }).then((data) =>
      data.map((font) => ({
        value: font.name,
        ...font,
      }))
    );
  }, [api.fonts]);

  const value = useMemo(
    () => ({
      state: { stories },
      actions: { fetchStories, getAllFonts },
    }),
    [stories, fetchStories, getAllFonts]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

ApiProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
