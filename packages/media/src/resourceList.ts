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
import type { ResourceId } from '@googleforcreators/types';

interface ResourceCacheEntry {
  url: string;
  type: 'cached' | 'fullsize';
}

interface ResourceCache {
  list: Record<ResourceId, ResourceCacheEntry>;
  get: (id: ResourceId) => ResourceCacheEntry | undefined;
  set: (id: ResourceId, value: ResourceCacheEntry) => void;
  resetList: () => void;
}

/**
 * Temporary list to hold currently used resources and their state.
 * { type: string (cached|smallest|fullsize), url: string }
 */

const resourceList: ResourceCache = {
  list: {},
  resetList: function () {
    this.list = {};
  },
  get: function (id: ResourceId): ResourceCacheEntry {
    return this.list[id];
  },
  set: function (id: ResourceId, value: ResourceCacheEntry): void {
    if (value?.type === 'cached' && this.list[id]) {
      // We already have better (or equal) resource than cached, prevent flickering
      return;
    }
    this.list[id] = value;
  },
};

export default resourceList;
