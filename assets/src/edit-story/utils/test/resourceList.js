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
 * Internal dependencies
 */
import resourceList from '../resourceList';

describe('resourceList', () => {
  beforeEach(() => {
    resourceList.resetList();
  });

  it('should set and get cached resource by id', () => {
    const id = 461;
    const resourceState = {
      type: 'cached',
      url: 'http://localhost/thumb.jpg',
    };

    resourceList.set(id, resourceState);
    const result = resourceList.get(id);

    expect(result).toStrictEqual(resourceState);
  });

  it('should start with empty list', () => {
    expect(resourceList.list).toStrictEqual({});
  });

  it('should not update the resource to lower(cached) quality', () => {
    const id = 461;
    const resourceStateCached = {
      type: 'cached',
      url: 'http://localhost/thumb.jpg',
    };
    const resourceStateFullsize = {
      type: 'fullsize',
      url: 'http://localhost/full.jpg',
    };

    resourceList.set(id, resourceStateCached);
    expect(resourceList.get(id)).toStrictEqual(resourceStateCached);

    resourceList.set(id, resourceStateFullsize);
    expect(resourceList.get(id)).toStrictEqual(resourceStateFullsize);

    resourceList.set(id, resourceStateCached);
    // Should not downgrade
    expect(resourceList.get(id)).toStrictEqual(resourceStateFullsize);
  });
});
