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
import { toUTCDate } from '../../../../date';
import reshapeStoryObject from '../../serializers/stories';

describe('reshapeStoryObject', () => {
  it('should reshape the response object with a date object', () => {
    const responseObj = {
      id: 27,
      date: '2020-03-26T20:57:24',
      date_gmt: '2020-03-26T20:57:24',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=27',
      },
      modified: '2020-03-26T21:42:14',
      modified_gmt: '2020-03-26T21:42:14',
      slug: '',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      title: { raw: 'Carlos Draft' },
      content: {
        rendered: `<p><html amp="" lang="en"><head><meta charSet="utf…></amp-story-page></amp-story></body></html></p>`,
        protected: false,
      },
      excerpt: { rendered: '', protected: false },
      author: 1,
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      featured_media_url: '',
      story_data: { pages: [{ id: 0, elements: [] }] },
      _embedded: { author: [{ id: 1, name: 'admin' }] },
    };

    const reshapedObj = reshapeStoryObject('http://editstory.com?action=edit')(
      responseObj
    );

    expect(reshapedObj).toMatchObject({
      id: 27,
      author: 'admin',
      title: 'Carlos Draft',
      status: 'draft',
      modified: toUTCDate('2020-03-26T21:42:14'),
      pages: [{ id: 0, elements: [] }],
      centerTargetAction: '',
      bottomTargetAction: 'http://editstory.com?action=edit&post=27',
      editStoryLink: 'http://editstory.com?action=edit&post=27',
    });
  });

  it('should return null if the ID is missing', () => {
    const responseObj = {
      date: '2020-03-26T20:57:24',
      date_gmt: '2020-03-26T20:57:24',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=27',
      },
      modified: '2020-03-26T21:42:14',
      modified_gmt: '2020-03-26T21:42:14',
      slug: '',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      title: { raw: 'Carlos Draft' },
      content: {
        rendered: `<p><html amp="" lang="en"><head><meta charSet="utf…></amp-story-page></amp-story></body></html></p>`,
        protected: false,
      },
      excerpt: { rendered: '', protected: false },
      author: 1,
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      featured_media_url: '',
      story_data: { pages: [{ id: 0, elements: [] }] },
      _embedded: { author: [{ id: 1, name: 'admin' }] },
    };

    const reshapedObj = reshapeStoryObject('http://editstory.com?action=edit')(
      responseObj
    );
    expect(reshapedObj).toBeNull();
  });

  it('should return null if the story has no pages', () => {
    const responseObj = {
      id: 27,
      date: '2020-03-26T20:57:24',
      date_gmt: '2020-03-26T20:57:24',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=27',
      },
      modified: '2020-03-26T21:42:14',
      modified_gmt: '2020-03-26T21:42:14',
      slug: '',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      title: { raw: 'Carlos Draft' },
      content: {
        rendered: `<p><html amp="" lang="en"><head><meta charSet="utf…></amp-story-page></amp-story></body></html></p>`,
        protected: false,
      },
      excerpt: { rendered: '', protected: false },
      author: 1,
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      featured_media_url: '',
      story_data: { pages: [] },
      _embedded: { author: [{ id: 1, name: 'admin' }] },
    };

    const reshapedObj = reshapeStoryObject('http://editstory.com?action=edit')(
      responseObj
    );
    expect(reshapedObj).toBeNull();
  });
});
