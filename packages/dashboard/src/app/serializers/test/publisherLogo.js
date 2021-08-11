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
import reshapePublisherLogo from '../publisherLogo';

describe('reshapePublisherLogo', () => {
  it('should return null if the ID is missing', () => {
    const responseObj = {
      alt_text: '',
      author: 1,
      caption: { rendered: '' },
      comment_status: 'open',
      date: '2021-07-07T01:52:21',
      date_gmt: '2021-07-06T15:52:21',
      description: { rendered: '' },
      featured_media: 0,
      featured_media_src: [],
      guid: {
        rendered: 'https://example.com/logo.png',
      },
      id: 1234,
      link: 'https://example.com/logo/',
      media_details: {
        width: 512,
        height: 512,
        file: '2021/07/wordpress-logo.png',
        sizes: {},
        image_meta: {},
      },
      media_source: '',
      media_type: 'image',
      meta: { web_stories_poster_id: 0, web_stories_optimized_id: 0 },
      mime_type: 'image/png',
      modified: '2021-07-07T01:52:21',
      modified_gmt: '2021-07-06T15:52:21',
      ping_status: 'closed',
      post: null,
      slug: 'wordpress-logo-3',
      source_url: 'https://example.com/logo.png',
      status: 'inherit',
      template: '',
      title: { rendered: 'example-logo' },
      type: 'attachment',
      web_story_media_source: [],
    };

    const reshapedObj = reshapePublisherLogo(responseObj);
    expect(reshapedObj).toStrictEqual({
      id: 1234,
      src: 'https://example.com/logo.png',
      title: 'example-logo',
    });
  });
});
