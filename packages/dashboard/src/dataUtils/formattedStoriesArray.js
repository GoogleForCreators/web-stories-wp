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
import { toUTCDate } from '@googleforcreators/date';

// @todo Remove WordPress specific and unused fields.
const formattedStoriesArray = [
  {
    id: 167,
    status: 'publish',
    title: 'ORANGE SHAPES',
    modified: toUTCDate('2020-05-21T23:25:51.000Z'),
    modifiedGmt: '2020-05-21T23:25:51.000Z',
    created: toUTCDate('2020-05-21T23:25:51.000Z'),
    createdGmt: '2020-05-21T23:25:51.000Z',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-1.png',
    tags: [],
    categories: [],
    author: {
      name: 'Jango Fett',
      id: 1,
    },
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=167',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=167',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=167',
  },
  {
    locked: true,
    lockUser: {
      name: 'batgirl',
      id: 888877665,
      avatar:
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y&s=96',
    },
    id: 168,
    status: 'publish',
    title: 'PURPLE SHAPES',
    modified: toUTCDate('2020-05-21T23:25:35.000Z'),
    modifiedGmt: '2020-05-21T23:25:35.000Z',
    created: toUTCDate('2020-05-21T23:25:35.000Z'),
    createdGmt: '2020-05-21T23:25:35.000Z',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-1.png',
    tags: [],
    categories: [{ name: 'StarWars', id: 1 }],
    author: {
      name: 'Jango Fett',
      id: 1,
    },
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=168',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=168',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=168',
  },
  {
    id: 165,
    status: 'draft',
    title: 'GREEN SHAPES',
    modified: toUTCDate('2020-05-21T23:25:22.000Z'),
    modifiedGmt: '2020-05-21T23:25:22.000Z',
    created: toUTCDate('2020-05-21T23:25:22.000Z'),
    createdGmt: '2020-05-21T23:25:22.000Z',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-2.png',
    tags: [],
    categories: [],
    author: {
      name: 'Chewbacca',
      id: 2,
    },
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=165',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=165',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=165',
  },
  {
    id: 163,
    status: 'draft',
    title: 'RED SHAPES',
    modified: toUTCDate('2020-05-21T23:24:47.000Z'),
    modifiedGmt: '2020-05-21T23:24:47.000Z',
    created: toUTCDate('2020-05-21T23:24:47.000Z'),
    createdGmt: '2020-05-21T23:24:47.000Z',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-3.png',
    tags: [],
    categories: [],
    author: {
      name: 'Luke Skywalker',
      id: 3,
    },
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=163',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=163',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=163',
  },
  {
    id: 161,
    status: 'private',
    title: 'BLUE SHAPES',
    modified: toUTCDate('2020-05-21T23:24:06.000Z'),
    modifiedGmt: '2020-05-21T23:24:06.000Z',
    created: toUTCDate('2020-05-21T23:24:06.000Z'),
    createdGmt: '2020-05-21T23:24:06.000Z',
    featuredMediaUrl: 'http://localhost:9876/__static__/featured-media-1.png',
    tags: [],
    categories: [],
    author: {
      name: 'Lando-Calrissian',
      id: 4,
    },
    bottomTargetAction:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=161',
    capabilities: {
      hasEditAction: true,
      hasDeleteAction: true,
    },
    editStoryLink:
      'http://localhost:8899/wp-admin/post.php?action=edit&post=161',
    previewLink: 'http://localhost:8899/wp-admin/post.php?action=edit&post=161',
  },
];

export default formattedStoriesArray;
