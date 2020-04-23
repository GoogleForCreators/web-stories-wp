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
import groupBy from '../groupBy';

describe('groupBy', () => {
  it('should shape an array of objects by a given key', () => {
    const initialArray = [
      { id: 94, status: 'draft', title: 'my test story 1' },
      { id: 65, status: 'published', title: 'my test story 2' },
      { id: 78, status: 'draft', title: 'my test story 3' },
      { id: 12, status: 'draft', title: 'my test story 4' },
    ];

    const groupedById = groupBy(initialArray, 'id');

    expect(groupedById).toMatchObject({
      94: { id: 94, status: 'draft', title: 'my test story 1' },
      65: { id: 65, status: 'published', title: 'my test story 2' },
      78: { id: 78, status: 'draft', title: 'my test story 3' },
      12: { id: 12, status: 'draft', title: 'my test story 4' },
    });
  });
});
