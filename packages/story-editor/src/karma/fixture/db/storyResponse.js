/*
 * Copyright 2021 Google LLC
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
import { DATA_VERSION } from '@web-stories-wp/migration';

const storyTags = [];
const storyVerticals = [];
const storyColors = [];
const storyCategories = [
  {
    id: 1,
    link: 'http://localhost:8899/story-category/booger',
    name: 'Booger',
    slug: 'booger',
    taxonomy: 'story-category',
    _links: {},
  },
  {
    id: 2,
    link: 'http://localhost:8899/story-category/multiple-words',
    name: 'Multiple words',
    slug: 'multiple-words',
    taxonomy: 'story-category',
    _links: {},
  },
  {
    id: 3,
    link: 'http://localhost:8899/story-category/gold',
    name: 'gold',
    slug: 'gold',
    taxonomy: 'story-category',
    _links: {},
  },
];

export default {
  title: { raw: '' },
  status: 'draft',
  author: 1,
  slug: '',
  date: '2020-05-06T22:32:37',
  date_gmt: '2020-05-06T22:32:37',
  modified: '2020-05-06T22:32:37',
  excerpt: { raw: '' },
  link: 'http://stories.local/?post_type=web-story&p=1',
  preview_link: 'http://stories.local/?post_type=web-story&p=1',
  story_data: {
    version: DATA_VERSION,
    pages: [],
  },
  featured_media: 0,
  permalink_template: 'http://stories3.local/stories/%pagename%/',
  style_presets: { textStyles: [], colors: [] },
  password: '',
  _embedded: {
    author: [{ id: 1, name: 'John Doe' }],
    'wp:publisherlogo': [
      {
        id: 0,
        source_url:
          'http://stories.local/wp-content/plugins/web-stories/assets/images/logo.png',
      },
    ],
    'wp:term': [storyTags, storyColors, storyCategories, storyVerticals],
  },
  _links: {
    'wp:action-assign-author': {
      href: 'http://stories.local/wp-json/web-stories/v1/web-story/1',
    },
    'wp:action-delete': {
      href: 'http://stories.local/wp-json/web-stories/v1/web-story/1',
    },
    'wp:action-publish': {
      href: 'http://stories.local/wp-json/web-stories/v1/web-story/1',
    },
    'wp:action-unfiltered-html': {
      href: 'http://stories.local/wp-json/web-stories/v1/web-story/1',
    },
    'wp:term': [
      {
        taxonomy: 'story-tag',
        embeddable: true,
        href: 'http://localhost:8899/wp-json/wp/v2/story-tags?post=1014',
      },
      {
        taxonomy: 'story-color',
        embeddable: true,
        href: 'http://localhost:8899/wp-json/wp/v2/story-colors?post=1014',
      },
      {
        taxonomy: 'story-category',
        embeddable: true,
        href: 'http://localhost:8899/wp-json/wp/v2/story-categories?post=1014',
      },
      {
        taxonomy: 'story-vertical',
        embeddable: true,
        href: 'http://localhost:8899/wp-json/wp/v2/story-verticals?post=1014',
      },
    ],
  },
};
