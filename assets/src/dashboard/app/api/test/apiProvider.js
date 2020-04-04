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
import moment from 'moment';

/**
 * Internal dependencies
 */
import { reshapeStoryObject } from '../apiProvider';

describe('reshapeStoryObject', () => {
  it('should reshape the response object with a Moment date', () => {
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
      title: { rendered: 'Carlos Draft' },
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
    };

    const reshapedObj = reshapeStoryObject(responseObj);
    expect(reshapedObj).toMatchObject({
      id: 27,
      title: 'Carlos Draft',
      status: 'draft',
      modified: moment('2020-03-26T21:42:14'),
      pages: [{ id: 0, elements: [] }],
    });
  });
});
