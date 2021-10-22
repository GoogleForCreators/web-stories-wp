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
import { toUTCDate } from '@web-stories-wp/date';

// @todo Remove WordPress specific and unused fields.
const formattedStoriesArray = [
  {
    locked: true,
    lockUser: {
      name: 'batgirl',
      id: 888877665,
    },
    id: 167,
    status: 'publish',
    title: 'ORANGE SHAPES',
    modified: toUTCDate('2020-05-21T23:25:51.000Z'),
    modifiedGmt: '2020-05-21T23:25:51.000Z',
    created: toUTCDate('2020-05-21T23:25:51.000Z'),
    created_gmt: '2020-05-21T23:25:51.000Z',
    featuredMediaUrl: 'http://placekitten.com/640/853',
    tags: [],
    categories: [],
    author: 'Jango Fett',
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=167',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=167',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=167',
    originalStoryData: {
      id: 167,
      date: '2020-05-21T23:25:51',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=167',
        raw: 'http://localhost:8899/?post_type=web-story&#038;p=167',
      },
      modified: '2020-05-21T23:25:51',
      password: '',
      slug: 'orange-shapes',
      status: 'publish',
      type: 'web-story',
      link: 'http://localhost:8899/web-stories/orange-shapes',
      preview_link: 'http://localhost:8899/web-stories/orange-shapes',
      edit_link: 'https://www.story-link.com/wp-admin/post.php?id=167',
      title: {
        raw: 'ORANGE SHAPES',
        rendered: 'ORANGE SHAPES',
      },
      excerpt: {
        raw: '',
        rendered: '',
        protected: false,
      },
      author: 'Jango Fett',
      featuredMedia: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'orange-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
    },
  },
  {
    id: 165,
    status: 'draft',
    title: 'GREEN SHAPES',
    modified: toUTCDate('2020-05-21T23:25:22.000Z'),
    modifiedGmt: '2020-05-21T23:25:22.000Z',
    created: toUTCDate('2020-05-21T23:25:22.000Z'),
    created_gmt: '2020-05-21T23:25:22.000Z',
    featuredMediaUrl: 'http://placekitten.com/640/853',
    tags: [],
    categories: [],
    author: 'Chewbacca',
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=165',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=165',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=165',
    originalStoryData: {
      id: 165,
      date: '2020-05-21T23:25:22',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=165',
        raw: 'http://localhost:8899/?post_type=web-story&#038;p=165',
      },
      modified: '2020-05-21T23:25:22',
      password: '',
      slug: 'green-shapes',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=165',
      preview_link: 'http://localhost:8899/?post_type=web-story&p=165',
      edit_link: 'https://www.story-link.com/wp-admin/post.php?id=165',
      title: {
        raw: 'GREEN SHAPES',
        rendered: 'GREEN SHAPES',
      },
      excerpt: {
        raw: '',
        rendered: '',
        protected: false,
      },
      author: 'Chewbacca',
      featuredMedia: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'green-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
    },
  },
  {
    id: 163,
    status: 'draft',
    title: 'RED SHAPES',
    modified: toUTCDate('2020-05-21T23:24:47.000Z'),
    modifiedGmt: '2020-05-21T23:24:47.000Z',
    created: toUTCDate('2020-05-21T23:24:47.000Z'),
    created_gmt: '2020-05-21T23:24:47.000Z',
    featuredMediaUrl: 'http://placekitten.com/640/853',
    tags: [],
    categories: [],
    author: 'Luke Skywalker',
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=163',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=163',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=163',
    originalStoryData: {
      id: 163,
      date: '2020-05-21T23:24:47',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=163',
        raw: 'http://localhost:8899/?post_type=web-story&#038;p=163',
      },
      modified: '2020-05-21T23:24:47',
      password: '',
      slug: 'red-shapes',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=163',
      preview_link: 'http://localhost:8899/?post_type=web-story&p=163',
      edit_link: 'https://www.story-link.com/wp-admin/post.php?id=163',
      title: {
        raw: 'RED SHAPES',
        rendered: 'RED SHAPES',
      },
      excerpt: {
        raw: '',
        rendered: '',
        protected: false,
      },
      author: 'Luke Skywalker',
      featuredMedia: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'red-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
    },
  },
  {
    id: 161,
    status: 'private',
    title: 'BLUE SHAPES',
    modified: toUTCDate('2020-05-21T23:24:06.000Z'),
    modifiedGmt: '2020-05-21T23:24:06.000Z',
    created: toUTCDate('2020-05-21T23:24:06.000Z'),
    created_gmt: '2020-05-21T23:24:06.000Z',
    featuredMediaUrl: 'http://placekitten.com/640/853',
    tags: [],
    categories: [],
    author: 'Lando-Calrissian',
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=161',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=161',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=161',
    originalStoryData: {
      id: 161,
      date: '2020-05-21T23:24:06',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=161',
        raw: 'http://localhost:8899/?post_type=web-story&#038;p=161',
      },
      modified: '2020-05-21T23:24:06',
      password: '',
      slug: 'blue-shapes',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=161',
      preview_link: 'http://localhost:8899/?post_type=web-story&p=161',
      edit_link: 'https://www.story-link.com/wp-admin/post.php?id=161',
      title: {
        raw: 'BLUE SHAPES',
        rendered: 'BLUE SHAPES',
      },
      excerpt: {
        raw: '',
        rendered: '',
        protected: false,
      },
      author: 'Lando-Calrissian',
      featuredMedia: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'blue-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
    },
  },
];

export default formattedStoriesArray;
