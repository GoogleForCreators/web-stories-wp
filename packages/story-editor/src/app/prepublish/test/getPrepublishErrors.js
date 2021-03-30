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
  beforeEach(jest.resetModules);
  it('should return guidance for the story', async () => {
    const testStory = {
      id: 120,
      pages: [{ id: 123, elements: [] }],
    };
    const result = await getPrepublishErrors(testStory);
    expect(result).toMatchSnapshot();
  });
  it('should return an empty array', async () => {
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
    expect((await getPrepublishErrors(testStory)) instanceof Array).toBeTrue();
    expect(await getPrepublishErrors(testStory)).toHaveLength(0);
  });

  it('should not throw errors if the checklist functions throw (and should not skip the others)', async () => {
    const mockFn = jest.fn(() => {
      throw new Error('What are you doing here?');
    });
    jest.doMock('../warning', () => {
      const actual = jest.requireActual('../warning').default;
      return {
        ...actual,
        story: [...actual.story, mockFn],
        page: [...actual.page, mockFn],
        image: [...actual.image, mockFn],
      };
    });
    const getPrepublishErrorsCopy = jest.requireActual('../getPrepublishErrors')
      .default;
    const malformedStory = {
      title: undefined,
      pages: [{ elements: [{ type: 'image', height: 1, width: 1 }] }],
    };
    expect(async () => {
      const result = await getPrepublishErrorsCopy(malformedStory);
      return result;
    }).not.toThrow();
    expect(mockFn).toHaveBeenCalledWith(malformedStory);
    expect(mockFn).toHaveBeenCalledTimes(3);
    const copyTest = await getPrepublishErrorsCopy(malformedStory);
    const test = await getPrepublishErrors(malformedStory);
    expect(test).toHaveLength(copyTest.length);
    test.forEach((obj, index) => {
      expect(obj.message).toStrictEqual(copyTest[index].message);
      expect(obj.type).toStrictEqual(copyTest[index].type);
    });
  });

  it('should provide the page number where the element that needs guidance is', async () => {
    const malformedStory = {
      title: undefined,
      pages: [
        {
          elements: [
            {
              id: 456,
              type: 'text',
              content: 'some normal text content, should not appear',
            },
          ],
        },
        {
          elements: [{ id: 123, type: 'image', height: 1, width: 1 }],
        },
      ],
    };
    const test = await getPrepublishErrors(malformedStory);
    const elementErrors = test.filter(({ elementId }) => Boolean(elementId));
    expect(elementErrors).toHaveLength(1);
    expect(elementErrors[0].page).toStrictEqual(2);
  });
});
