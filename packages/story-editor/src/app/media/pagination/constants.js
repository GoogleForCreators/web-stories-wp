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
export const INITIAL_STATE = {
  media: [],
  // The page token of the last loaded page, or undefined if at the first page
  // or no pages have been loaded.
  pageToken: undefined,
  // The page token of the next page, or undefined if at the last page or no
  // pages have been loaded.
  nextPageToken: undefined,
  hasMore: true,
  totalPages: 1,
  isMediaLoading: false,
  isMediaLoaded: false,
  totalItems: 0,
};
