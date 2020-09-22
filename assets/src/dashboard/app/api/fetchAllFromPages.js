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
import queryString from 'query-string';

/**
 * This function takes a response from the WordPress fetch and will query
 * for every entity for every possible page. This is used for tags, categories, and users
 * on the Dashboard where individual requests for each story on each layout would not
 * be ideal.
 *
 * @param response The response from the initial wpFetch call
 * @param dataAdapter The WP Data Adapter that will make the additional page fetch requests
 * @param apiString The base url for the fetch calls
 * @return Promise<any[]> A flattened array with all the entities
 */

export default async function fetchAllFromTotalPages(
  response,
  dataAdapter,
  apiString
) {
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages'));
  const additionalRequests = [];

  if (totalPages > 1) {
    for (let i = 2; i <= totalPages; i++) {
      additionalRequests.push(
        dataAdapter.get(
          queryString.stringifyUrl({
            url: apiString,
            query: { page: i },
          })
        )
      );
    }
  }
  try {
    return (await Promise.all([response.json(), ...additionalRequests])).flat(
      1
    );
  } catch (e) {
    return [];
  }
}
