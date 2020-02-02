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
import { setupReducer } from './_utils';

describe('updateStory', () => {
  it('should update story with given properties', () => {
    const { updateStory } = setupReducer();

    const result = updateStory({ properties: { a: 1, b: 2 } });

    expect(result.story).toStrictEqual({ a: 1, b: 2 });
  });

  it('should overwrite existing properties but not delete old ones', () => {
    const { updateStory } = setupReducer();

    const firstResult = updateStory({ properties: { a: 1, b: 2 } });
    expect(firstResult.story).toStrictEqual({ a: 1, b: 2 });

    const secondResult = updateStory({ properties: { b: 3, c: 4 } });
    expect(secondResult.story).toStrictEqual({ a: 1, b: 3, c: 4 });
  });
});
