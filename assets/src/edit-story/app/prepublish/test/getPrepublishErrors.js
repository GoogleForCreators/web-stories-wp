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
import { getPrepublishErrors } from '..';
const DEFAULT_STORY_PROPS = {
  featuredMedia: {
    url: 'https://greatimageaggregate.com/1234',
  },
  title: 'How to get rich',
  excerpt: "There's a secret no one wants you to know about",
};
describe('prepublish checklist', () => {
  it('should return guidance for the story', () => {
    const testStory = {
      id: 120,
      pages: [{ id: 123, elements: [] }],
    };
    expect(getPrepublishErrors(testStory)).toMatchSnapshot();
  });
  it('should return an empty array', () => {
    const testStory = {
      id: 456,
      ...DEFAULT_STORY_PROPS,
      pages: [
        {
          id: 1,
          elements: [
            {
              type: 'text',
              content: 'The prepublish checklist should return an empty array',
            },
          ],
        },
        {
          id: 2,
          elements: [
            {
              type: 'text',
              content: 'A story needs at least 100 characters',
            },
          ],
        },
        {
          id: 3,
          elements: [
            {
              type: 'text',
              content: 'There once was a man from Nantucket...',
            },
          ],
        },
        {
          id: 4,
          elements: [],
        },
      ],
    };
    expect(getPrepublishErrors(testStory) instanceof Array).toBeTrue();
    expect(getPrepublishErrors(testStory)).toHaveLength(0);
  });

  it.todo('story-based guidelines');
  it.todo('page-based guidelines');
  it.todo('element-based guidelines');
});
