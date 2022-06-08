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
import { getStoryMarkup } from '@googleforcreators/output';

/**
 * Internal dependencies
 */
import getStoryPropsToSave from '../getStoryPropsToSave';

jest.mock('@googleforcreators/output', () => ({
  getStoryMarkup: jest.fn(),
}));

describe('getStoryPropsToSave', () => {
  it('should return correct story properties', () => {
    const neededProps = {
      title: 'Story!',
      author: { id: 1, name: 'John Doe' },
      slug: 'story',
      publisherLogo: {
        id: 1,
        url: 'https://example.com/logo.png',
        height: 0,
        width: 0,
      },
      status: 'publish',
      date: '2020-04-10T07:06:26',
      modified: '',
      excerpt: '',
      featuredMedia: { id: 0 },
      password: '',
      globalStoryStyles: '',
      autoAdvance: 'manual',
      defaultPageDuration: 7,
      backgroundAudio: {
        resource: {
          src: 'https://example.com/audio.mp3',
          id: 123,
          mimeType: 'audio/mpeg',
        },
      },
      taxonomies: [],
    };
    const extraProps = {
      storyId: 1,
      foo: 'bar',
    };
    const story = {
      ...neededProps,
      ...extraProps,
    };
    const pages = [{ id: '1' }, { id: '2' }];
    const metadata = {};
    getStoryMarkup.mockImplementation(() => {
      return 'Hello World!';
    });
    const props = getStoryPropsToSave({ story, pages, metadata });

    const expected = {
      content: 'Hello World!',
      pages,
      ...neededProps,
      meta: {
        web_stories_products: [],
        web_stories_publisher_logo: 1,
      },
    };
    delete expected.publisherLogo;
    delete expected.taxonomies;

    expect(props).toStrictEqual(expected);
  });
});
