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

const TEST_COLOR = {
  color: { r: 1, g: 1, b: 1 },
};

export function createStory(properties = {}) {
  return {
    title: { raw: 'title' },
    excerpt: { raw: 'excerpt' },
    permalink_template: 'http://localhost:8899/web-stories/%pagename%',
    style_presets: { colors: [TEST_COLOR] },
    _embedded: { author: [{ id: 1, name: 'John Doe' }] },
    ...properties,
  };
}

export const GET_MEDIA_RESPONSE_HEADER = {
  'X-WP-Total': 1,
  'X-WP-TotalPages': 1,
};
export const GET_MEDIA_RESPONSE_BODY = [
  {
    id: 274,
    date: '2020-09-01T05:33:54',
    date_gmt: '2020-09-01T05:33:54',
    guid: {
      rendered: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
      raw: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
    },
    modified: '2020-09-01T05:33:54',
    modified_gmt: '2020-09-01T05:33:54',
    slug: 'IMAGE',
    status: 'inherit',
    type: 'attachment',
    link: 'http://wp.local/IMAGE/',
    title: {
      raw: 'IMAGE',
      rendered: 'IMAGE',
    },
    author: { id: 1, name: 'John Doe' },
    featured_media: 0,
    comment_status: 'open',
    ping_status: 'closed',
    template: '',
    meta: { web_stories_is_poster: false, web_stories_poster_id: 0 },
    web_story_media_source: [2],
    permalink_template: 'http://wp.local/?attachment_id=274',
    generated_slug: 'IMAGE',
    media_source: 'editor',
    featured_media_src: [],
    description: {
      raw: '',
      rendered: '<p class="attachment">link</p>\n',
    },
    caption: { raw: '', rendered: '' },
    alt_text: '',
    media_type: 'image',
    mime_type: 'image/jpeg',
    media_details: {
      width: 1080,
      height: 2220,
      file: '2020/09/IMAGE.jpg',
      sizes: {
        medium: {
          file: 'IMAGE-146x300.jpg',
          width: 146,
          height: 300,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-146x300.jpg',
        },
        large: {
          file: 'IMAGE-498x1024.jpg',
          width: 498,
          height: 1024,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-498x1024.jpg',
        },
        thumbnail: {
          file: 'IMAGE-150x150.jpg',
          width: 150,
          height: 150,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-150x150.jpg',
        },
        medium_large: {
          file: 'IMAGE-768x1579.jpg',
          width: 768,
          height: 1579,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-768x1579.jpg',
        },
        '1536x1536': {
          file: 'IMAGE-747x1536.jpg',
          width: 747,
          height: 1536,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-747x1536.jpg',
        },
        '2048x2048': {
          file: 'IMAGE-996x2048.jpg',
          width: 996,
          height: 2048,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-996x2048.jpg',
        },
        'web-stories-poster-portrait': {
          file: 'IMAGE-640x853.jpg',
          width: 640,
          height: 853,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-640x853.jpg',
        },
        'web-stories-poster-landscape': {
          file: 'IMAGE-853x640.jpg',
          width: 853,
          height: 640,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-853x640.jpg',
        },
        'web-stories-poster-square': {
          file: 'IMAGE-640x640.jpg',
          width: 640,
          height: 640,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-640x640.jpg',
        },
        'web-stories-publisher-logo': {
          file: 'IMAGE-96x96.jpg',
          width: 96,
          height: 96,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-96x96.jpg',
        },
        'web-stories-thumbnail': {
          file: 'IMAGE-150x308.jpg',
          width: 150,
          height: 308,
          mime_type: 'image/jpeg',
          source_url:
            'http://wp.local/wp-content/uploads/2020/09/IMAGE-150x308.jpg',
        },
        full: {
          file: 'IMAGE.jpg',
          width: 1080,
          height: 2220,
          mime_type: 'image/jpeg',
          source_url: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
        },
      },
      image_meta: {
        aperture: '0',
        credit: '',
        camera: '',
        caption: '',
        created_timestamp: '0',
        copyright: '',
        focal_length: '0',
        iso: '0',
        shutter_speed: '0',
        title: '',
        orientation: '0',
        keywords: [],
      },
    },
    post: null,
    source_url: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
    missing_image_sizes: [],
    _links: {
      self: [{ href: 'http://wp.local/wp-json/web-stories/v1/media/274' }],
      collection: [{ href: 'http://wp.local/wp-json/web-stories/v1/media' }],
      about: [{ href: 'http://wp.local/wp-json/wp/v2/types/attachment' }],
      author: [
        { embeddable: true, href: 'http://wp.local/wp-json/wp/v2/users/1' },
      ],
      replies: [
        {
          embeddable: true,
          href: 'http://wp.local/wp-json/wp/v2/comments?post=274',
        },
      ],
      'wp:term': [
        {
          taxonomy: 'web_story_media_source',
          embeddable: true,
          href: 'http://wp.local/wp-json/wp/v2/web_story_media_source?post=274',
        },
      ],
      'wp:action-unfiltered-html': [
        { href: 'http://wp.local/wp-json/web-stories/v1/media/274' },
      ],
      'wp:action-assign-author': [
        { href: 'http://wp.local/wp-json/web-stories/v1/media/274' },
      ],
      'wp:action-create-web_story_media_source': [
        { href: 'http://wp.local/wp-json/web-stories/v1/media/274' },
      ],
      'wp:action-assign-web_story_media_source': [
        { href: 'http://wp.local/wp-json/web-stories/v1/media/274' },
      ],
      curies: [
        { name: 'wp', href: 'https://api.w.org/{rel}', templated: true },
      ],
    },
  },
];
