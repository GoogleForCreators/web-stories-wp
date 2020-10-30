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
import * as metadataGuidelines from '../metadata';

describe('Pre-publish checklist - missing critical metadata (errors)', () => {
  it('should return an error-type guidance message if the story is missing its portrait cover', () => {
    const testStory = {
      storyId: 890,
      title: 'Work work work work work',
      featuredMediaUrl: undefined,
    };
    const testMissingCover = metadataGuidelines.storyCoverAttached(testStory);
    expect(testMissingCover).not.toBeUndefined();
    expect(testMissingCover.message).toMatchInlineSnapshot(
      `"Missing story cover"`
    );
    expect(testMissingCover.storyId).toStrictEqual(testStory.storyId);
  });

  it.todo(
    "should return an error-type guidance message if the story is missing it's title"
  );
  it.todo(
    "should return an error-type guidance message if the story's publisher logo is too small"
  );
  it.todo(
    'should return an error-type guidance message if there is a link in the page attachment region'
  );

  // todo the story's cover sizes are not returned by the api
  it.todo(
    "should return an error-type guidance message if the story's portrait cover is too small"
  );
});
