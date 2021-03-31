/*
 * Copyright 2021 Google LLC
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

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';
import { createContext } from '../../../design-system';
import useStoryApi from './useStoryApi';
import useUsersApi from './useUserApi';

export const StoriesBlockApiContext = createContext({ state: {}, actions: {} });

export default function StoriesBlockApiProvider({ children }) {
  const { api, editStoryURL } = useConfig();

  const { api: usersApi, authorSuggestions } = useUsersApi({
    usersApi: api.users,
  });

  const { stories, api: storyApi } = useStoryApi({
    editStoryURL,
    storyApi: api.stories,
  });

  const value = useMemo(
    () => ({
      state: {
        stories,
        authorSuggestions,
      },
      actions: {
        storyApi,
        usersApi,
      },
    }),
    [stories, storyApi, usersApi, authorSuggestions]
  );

  return (
    <StoriesBlockApiContext.Provider value={value}>
      {children}
    </StoriesBlockApiContext.Provider>
  );
}

StoriesBlockApiProvider.propTypes = {
  children: PropTypes.node,
};
