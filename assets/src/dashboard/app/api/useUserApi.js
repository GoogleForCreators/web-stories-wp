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
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import queryString from 'query-string';
import groupBy from '../../utils/groupBy';
import fetchAllFromTotalPages from './fetchAllFromPages';

export default function useUserApi(dataAdapter, { userApi }) {
  const [users, setUsers] = useState({});
  const fetchUsers = useCallback(async () => {
    try {
      const response = await dataAdapter.get(
        queryString.stringifyUrl({
          url: userApi,
          query: { per_page: 100 },
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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return useMemo(
    () => ({
      api: { fetchUsers },
      users,
    }),
    [fetchUsers, users]
  );
}
