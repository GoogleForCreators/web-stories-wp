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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../dashboard/app/config';
import { createContext } from '../../../dashboard/utils';
import dataAdapter from '../../../dashboard/app/api/wpAdapter';
import useStoryApi from './useStoryApi';
import useUsersApi from './useUserApi';

export const StoriesBlockApiContext = createContext({ state: {}, actions: {} });

export default function StoriesBlockApiProvider({ children }) {
  const { api, editStoryURL } = useConfig();

  const { api: usersApi, authorSuggestions } = useUsersApi(dataAdapter, {
    usersApi: api.users,
  });

  const { stories, api: storyApi } = useStoryApi(dataAdapter, {
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
