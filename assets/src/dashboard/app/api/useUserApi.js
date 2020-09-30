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
import { useCallback, useMemo, useState } from 'react';
import queryString from 'query-string';

/**
 * Internal dependencies
 */
import { USERS_PER_REQUEST } from '../../constants';
import groupBy from '../../utils/groupBy';
import fetchAllFromTotalPages from './fetchAllFromPages';

export default function useUserApi(dataAdapter, { userApi, currentUserApi }) {
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const fetchUsers = useCallback(async () => {
    try {
      const response = await dataAdapter.get(
        queryString.stringifyUrl({
          url: userApi,
          query: { per_page: USERS_PER_REQUEST },
        }),
        {
          parse: false,
        }
      );

      const usersJson = await fetchAllFromTotalPages(
        response,
        dataAdapter,
        userApi
      );

      setUsers(
        groupBy(
          usersJson.map(({ _links, ...user }) => user),
          'id'
        )
      );
    } catch (e) {
      setUsers({});
    }
  }, [dataAdapter, userApi]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setCurrentUser(await dataAdapter.get(currentUserApi));
    } catch (e) {
      setCurrentUser({});
    }
  }, [dataAdapter, currentUserApi]);

  const toggleWebStoriesTrackingOptIn = useCallback(async () => {
    setIsUpdating(true);
    try {
      setCurrentUser(
        await dataAdapter.post(currentUserApi, {
          data: {
            meta: {
              web_stories_tracking_optin: !currentUser.meta
                .web_stories_tracking_optin,
            },
          },
        })
      );
    } finally {
      setIsUpdating(false);
    }
  }, [dataAdapter, currentUser, currentUserApi]);

  return useMemo(
    () => ({
      api: { fetchUsers, fetchCurrentUser, toggleWebStoriesTrackingOptIn },
      users,
      currentUser: { data: currentUser, isUpdating },
    }),
    [
      fetchUsers,
      fetchCurrentUser,
      toggleWebStoriesTrackingOptIn,
      users,
      currentUser,
      isUpdating,
    ]
  );
}
