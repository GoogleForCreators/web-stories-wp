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
/**
 * Internal dependencies
 */
import { storyMissingExcerpt } from '../storyMissingExcerpt';

describe('storyMissingExcerpt', () => {
  it('should return true if story is missing excerpt', () => {
    const excerpt = undefined;
    const test = storyMissingExcerpt(excerpt);
    expect(test).toBeTrue();
  });

  it('should return true if story has empty excerpt', () => {
    const excerpt = '';
    const test = storyMissingExcerpt(excerpt);

    expect(test).toBeTrue();
  });

  it('should return true if story has excerpt', () => {
    const excerpt = 'This is an excerpt';
    const test = storyMissingExcerpt(excerpt);
    expect(test).toBeFalse();
  });
});
