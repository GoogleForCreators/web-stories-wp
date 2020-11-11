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
import * as distributionChecks from '../distribution';

describe('Pre-publish checklist - distribution issues (warnings)', () => {
  describe('storyMissingExcerpt', () => {
    it('should return a warning if story is missing excerpt', () => {
      const story = {
        id: 'storyid',
      };
      expect(distributionChecks.storyMissingExcerpt(story)).toStrictEqual({
        message: 'Missing story excerpt',
        storyId: story.id,
        type: 'warning',
      });
    });

    it('should return a warning if story has empty excerpt', () => {
      const story = {
        id: 'storyid',
        excerpt: '',
      };
      expect(distributionChecks.storyMissingExcerpt(story)).toStrictEqual({
        message: 'Missing story excerpt',
        storyId: story.id,
        type: 'warning',
      });
    });

    it('should return undefined if story has excerpt', () => {
      const story = {
        id: 'storyid',
        excerpt: 'This is an excerpt',
      };
      expect(distributionChecks.storyMissingExcerpt(story)).toBeUndefined();
    });
  });
});
