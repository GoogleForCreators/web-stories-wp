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
    modified_gmt: '2020-05-21T23:25:51.000Z',
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
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'orange-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
      _embedded: {
        'wp:featuredmedia': [{ id: 0, source_url: '' }],
        'wp:publisherlogo': [{ id: 0, source_url: '' }],
        author: [{ id: 3, name: 'Jango Fett' }],
      },
      _links: {
        self: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        collection: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story',
          },
        ],
        about: [
          {
            href: 'http://localhost:8899/wp-json/wp/v2/types/web-story',
          },
        ],
        author: [
          {
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/users/3',
          },
        ],
        'version-history': [
          {
            count: 1,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167/revisions',
          },
        ],
        'predecessor-version': [
          {
            id: 168,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167/revisions/168',
          },
        ],
        'wp:attachment': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/media?parent=167',
          },
        ],
        'wp:term': [
          {
            taxonomy: 'category',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/categories?post=167',
          },
          {
            taxonomy: 'post_tag',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/tags?post=167',
          },
        ],
        'wp:action-publish': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-edit': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-delete': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-unfiltered-html': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-assign-author': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-create-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-assign-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-create-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        'wp:action-assign-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/167',
          },
        ],
        curies: [
          {
            name: 'wp',
            href: 'https://api.w.org/{rel}',
            templated: true,
          },
        ],
      },
    },
  },
  {
    id: 165,
    status: 'draft',
    title: 'GREEN SHAPES',
    modified: toUTCDate('2020-05-21T23:25:22.000Z'),
    modified_gmt: '2020-05-21T23:25:22.000Z',
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
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'green-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
      _embedded: {
        'wp:featuredmedia': [{ id: 0, source_url: '' }],
        'wp:publisherlogo': [{ id: 0, source_url: '' }],
        author: [{ id: 21, name: 'Chewbacca' }],
      },
      _links: {
        self: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        collection: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story',
          },
        ],
        about: [
          {
            href: 'http://localhost:8899/wp-json/wp/v2/types/web-story',
          },
        ],
        author: [
          {
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/users/1',
          },
        ],
        'version-history': [
          {
            count: 1,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165/revisions',
          },
        ],
        'predecessor-version': [
          {
            id: 166,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165/revisions/166',
          },
        ],
        'wp:attachment': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/media?parent=165',
          },
        ],
        'wp:term': [
          {
            taxonomy: 'category',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/categories?post=165',
          },
          {
            taxonomy: 'post_tag',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/tags?post=165',
          },
        ],
        'wp:action-publish': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-edit': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-delete': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-unfiltered-html': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-assign-author': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-create-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-assign-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-create-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        'wp:action-assign-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/165',
          },
        ],
        curies: [
          {
            name: 'wp',
            href: 'https://api.w.org/{rel}',
            templated: true,
          },
        ],
      },
    },
  },
  {
    id: 163,
    status: 'draft',
    title: 'RED SHAPES',
    modified: toUTCDate('2020-05-21T23:24:47.000Z'),
    modified_gmt: '2020-05-21T23:24:47.000Z',
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
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'red-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
      _embedded: {
        'wp:featuredmedia': [{ id: 0, source_url: '' }],
        'wp:publisherlogo': [{ id: 0, source_url: '' }],
        author: [{ id: 4, name: 'Luke Skywalker' }],
      },
      _links: {
        self: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        collection: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story',
          },
        ],
        about: [
          {
            href: 'http://localhost:8899/wp-json/wp/v2/types/web-story',
          },
        ],
        author: [
          {
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/users/4',
          },
        ],
        'version-history': [
          {
            count: 1,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163/revisions',
          },
        ],
        'predecessor-version': [
          {
            id: 164,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163/revisions/164',
          },
        ],
        'wp:attachment': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/media?parent=163',
          },
        ],
        'wp:term': [
          {
            taxonomy: 'category',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/categories?post=163',
          },
          {
            taxonomy: 'post_tag',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/tags?post=163',
          },
        ],
        'wp:action-publish': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-edit': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-delete': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-unfiltered-html': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-assign-author': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-create-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-assign-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-create-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        'wp:action-assign-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        curies: [
          {
            name: 'wp',
            href: 'https://api.w.org/{rel}',
            templated: true,
          },
        ],
      },
    },
  },
  {
    id: 161,
    status: 'private',
    title: 'BLUE SHAPES',
    modified: toUTCDate('2020-05-21T23:24:06.000Z'),
    modified_gmt: '2020-05-21T23:24:06.000Z',
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
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      permalink_template: 'http://localhost:8899/web-stories/%pagename%',
      generated_slug: 'blue-shapes',
      style_presets: {
        colors: [],
        textStyles: [],
      },
      _embedded: {
        'wp:featuredmedia': [{ id: 0, source_url: '' }],
        'wp:publisherlogo': [{ id: 0, source_url: '' }],
        author: [{ id: 2, name: 'Lando-Calrissian' }],
      },
      _links: {
        self: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        collection: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story',
          },
        ],
        about: [
          {
            href: 'http://localhost:8899/wp-json/wp/v2/types/web-story',
          },
        ],
        author: 'Lando-Calrissian',
        'version-history': [
          {
            count: 1,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161/revisions',
          },
        ],
        'predecessor-version': [
          {
            id: 162,
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161/revisions/162',
          },
        ],
        'wp:attachment': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/media?parent=161',
          },
        ],
        'wp:term': [
          {
            taxonomy: 'category',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/categories?post=161',
          },
          {
            taxonomy: 'post_tag',
            embeddable: true,
            href: 'http://localhost:8899/wp-json/wp/v2/tags?post=161',
          },
        ],
        'wp:action-publish': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-edit': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-delete': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-unfiltered-html': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-assign-author': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-create-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-assign-categories': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-create-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        'wp:action-assign-tags': [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/161',
          },
        ],
        curies: [
          {
            name: 'wp',
            href: 'https://api.w.org/{rel}',
            templated: true,
          },
        ],
      },
    },
  },
];

export default formattedStoriesArray;
