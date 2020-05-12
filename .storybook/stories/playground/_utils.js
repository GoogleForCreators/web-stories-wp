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

export const createStory = ({
  id = 1,
  baseUrl = 'http://localhost:8898',
  date = '2020-05-03T06:31:31',
  ...properties
}) => ({
  id,
  date,
  date_gmt: date,
  guid: {
    rendered: `${baseUrl}/?post_type=web-story&p=${id}`,
    raw: `${baseUrl}/?post_type=web-story&p=${id}`,
    ...properties.guid,
  },
  modified: date,
  modified_gmt: date,
  password: '',
  slug: '',
  status: 'auto-draft',
  type: 'web-story',
  link: `${baseUrl}/?post_type=web-story&p=${id}`,
  title: { raw: 'Auto Draft', rendered: 'Auto Draft' },
  content: { raw: '', rendered: '', protected: false, block_version: 0 },
  excerpt: { raw: '', rendered: '', protected: false },
  author: 1,
  featured_media: 0,
  template: '',
  categories: [],
  tags: [],
  permalink_template: `${baseUrl}/stories/%pagename%`,
  generated_slug: 'auto-draft',
  story_data: [],
  featured_media_url: '',
  publisher_logo_url: `${baseUrl}/wp-content/plugins/web-stories/assets/images/fallback-wordpress-publisher-logo.png`,
  style_presets: { fillColors: [], textColors: [], textStyles: [] },
  _links: {
    self: [{ href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` }],
    collection: [{ href: `${baseUrl}/wp-json/wp/v2/web-story` }],
    about: [{ href: `${baseUrl}/wp-json/wp/v2/types/web-story` }],
    author: [
      {
        embeddable: true,
        href: `${baseUrl}/wp-json/wp/v2/users/1`,
      },
    ],
    'version-history': [
      {
        count: 0,
        href: `${baseUrl}/wp-json/wp/v2/web-story/${id}/revisions`,
      },
    ],
    'wp:attachment': [{ href: `${baseUrl}/wp-json/wp/v2/media?parent=${id}` }],
    'wp:term': [
      {
        taxonomy: 'category',
        embeddable: true,
        href: `${baseUrl}/wp-json/wp/v2/categories?post=${id}`,
      },
      {
        taxonomy: 'post_tag',
        embeddable: true,
        href: `${baseUrl}/wp-json/wp/v2/tags?post=${id}`,
      },
    ],
    'wp:action-publish': [{ href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` }],
    'wp:action-unfiltered-html': [
      { href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` },
    ],
    'wp:action-assign-author': [
      { href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` },
    ],
    'wp:action-create-categories': [
      { href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` },
    ],
    'wp:action-assign-categories': [
      { href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` },
    ],
    'wp:action-create-tags': [
      { href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` },
    ],
    'wp:action-assign-tags': [
      { href: `${baseUrl}/wp-json/wp/v2/web-story/${id}` },
    ],
    curies: [{ name: 'wp', href: 'https://api.w.org/{rel}', templated: true }],
    ...properties._links,
  },
  ...properties,
});
