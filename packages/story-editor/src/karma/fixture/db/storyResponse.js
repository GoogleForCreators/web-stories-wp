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

const storyTags = [
  {
    id: 1,
    link: 'http://localhost:8899/web_story_category/gold/pizza',
    name: 'pizza',
    slug: 'pizza',
    taxonomy: 'web_story_tag',
    _links: {},
  },
  {
    id: 2,
    link: 'http://localhost:8899/web_story_category/burger',
    name: 'burger',
    slug: 'burger',
    taxonomy: 'web_story_tag',
    _links: {},
  },
  {
    id: 3,
    link: 'http://localhost:8899/web_story_category/frenchFry',
    name: 'frenchFry',
    slug: 'frenchFry',
    taxonomy: 'web_story_tag',
    _links: {},
  },
];
const storyVerticals = [];
const storyColors = [];
const storyCategories = [
  {
    id: 1,
    link: 'http://localhost:8899/web_story_category/booger',
    name: 'Booger',
    slug: 'booger',
    taxonomy: 'web_story_category',
    parent: 0,
    _links: {},
  },
  {
    id: 2,
    link: 'http://localhost:8899/web_story_category/multiple-words',
    name: 'Multiple words',
    slug: 'multiple-words',
    taxonomy: 'web_story_category',
    parent: 0,
    _links: {},
  },
  {
    id: 3,
    link: 'http://localhost:8899/web_story_category/gold',
    name: 'gold',
    slug: 'gold',
    taxonomy: 'web_story_category',
    parent: 0,
    _links: {},
  },
];

export default {
  title: { raw: '' },
  status: 'draft',
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
  permalink_template: 'http://stories3.local/stories/%pagename%/',
  style_presets: { textStyles: [], colors: [] },
  password: '',
  author: { id: 1, name: 'John Doe' },
  capabilities: {
    publish: true,
    'assign-author': true,
    'assign-web_story_tag': true,
    'create-web_story_tag': true,
    'assign-web_story_category': true,
    'create-web_story_category': true,
  },
  lock_user: {
    id: 0,
    name: '',
    avatar: '',
  },
  featured_media: {
    id: 0,
    height: 0,
    width: 0,
    url: '',
  },
  publisher_logo: {
    id: 0,
    height: 0,
    width: 0,
    url: 'http://stories.local/wp-content/plugins/web-stories/assets/images/logo.png',
  },
  taxonomies: [
    {
      taxonomy: 'web-story_tag',
      embeddable: true,
      href: 'http://localhost:8899/wp-json/web-stories/v1/web_story_tag?post=1014',
    },
    {
      taxonomy: 'web-story_category',
      embeddable: true,
      href: 'http://localhost:8899/wp-json/web-stories/v1/web_story_category?post=1014',
    },
  ],
  terms: [storyTags, storyColors, storyCategories, storyVerticals],
};
