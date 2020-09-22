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
 * Functions exposed from {@link ./useMedia3pApi}.
 *
 * @typedef {(obj:{
 * provider: string,
 * contentType: ?string,
 * searchTerm: ?string,
 * categoryId: ?string,
 * orderBy: ?string,
 * pageToken: ?string
 * }) => Promise<{nextPageToken: *, media: *}>} ListMediaFn
 *
 * @typedef {(obj:{provider: string, orderBy: ?string})
 * => Promise<{categories: *}>} ListCategoriesFn
 *
 * @typedef {(obj:{registerUsageUrl: string})
 * => Promise<undefined>} RegisterUsageFn
 */

/**
 * Media3pApi Context Value
 *
 * @typedef Media3pApiContext
 * @property {Object} actions contains all the actions used to interact with
 * media3p api
 * @property {ListMediaFn} actions.listMedia list media
 * @property {ListCategoriesFn} actions.listCategoriesFn list categories
 * @property {RegisterUsageFn} actions.registerUsage register usage
 */

// This is required so that the IDE doesn't ignore this file.
// Without it the types don't show up when you use {import('./typedefs)}.
export default {};
