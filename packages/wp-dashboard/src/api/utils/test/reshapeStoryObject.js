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
import { REST_LINKS } from '../../constants';
import reshapeStoryObject from '../reshapeStoryObject';

describe('reshapeStoryObject', () => {
  it('should return object', () => {
    const responseObj = {
      id: 27,
      date: '2020-03-26T20:57:24',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=27',
      },
      modified: '2020-03-26T21:42:14',
      slug: '',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      title: { raw: 'Carlos Draft' },
      excerpt: { rendered: '', protected: false },
      author: 1,
      featured_media: 33,
      preview_link: 'http://localhost:8899/preview/27',
      edit_link: 'http://localhost:8899/edit/27',
      template: '',
      categories: [],
      tags: [],
      meta: {
        web_stories_poster: {},
      },
      _embedded: {
        'wp:featuredmedia': [
          {
            id: 33,
            source_url: 'http://localhost:8899/wp-content/uploads/poster.jpg',
          },
        ],
        author: [{ id: 1, name: 'admin' }],
        'wp:lock': [{ locked: true, time: '1628506372', user: 1 }],
        'wp:lockuser': [
          {
            id: 1,
            name: 'admin',
            url: 'http://localhost:8899',
            description: '',
            link: 'http://localhost:8899/author/admin',
            avatar_urls: {
              24: 'http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=24&d=mm&r=g',
              48: 'http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=48&d=mm&r=g',
              96: 'http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=96&d=mm&r=g',
            },
          },
        ],
      },
    };

    const reshapedObj = reshapeStoryObject(responseObj);
    expect(reshapedObj).toMatchObject({
      author: {
        name: 'admin',
        id: 1,
      },
      bottomTargetAction: 'http://localhost:8899/edit/27',
      created: '2020-03-26T20:57:24',
      createdGmt: 'undefinedZ',
      editStoryLink: 'http://localhost:8899/edit/27',
      featuredMediaUrl: 'http://localhost:8899/wp-content/uploads/poster.jpg',
      id: 27,
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      lockUser: {
        avatar:
          'http://2.gravatar.com/avatar/b642b4217b34b1e8d3bd915fc65c4452?s=96&d=mm&r=g',
        id: 1,
        name: 'admin',
      },
      locked: true,
      modified: '2020-03-26T21:42:14',
      modifiedGmt: 'undefinedZ',
      previewLink: 'http://localhost:8899/preview/27',
      status: 'draft',
      title: 'Carlos Draft',
    });
  });

  it('should return object without avatar', () => {
    const responseObj = {
      id: 27,
      date: '2020-03-26T20:57:24',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=27',
      },
      modified: '2020-03-26T21:42:14',
      slug: '',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      title: { raw: 'Carlos Draft' },
      excerpt: { rendered: '', protected: false },
      author: 1,
      featured_media: 0,
      preview_link: 'http://localhost:8899/preview/27',
      edit_link: 'http://localhost:8899/edit/27',
      template: '',
      categories: [],
      tags: [],
      meta: {
        web_stories_poster: {},
      },
      _embedded: {
        'wp:featuredmedia': [
          {
            id: 33,
            source_url: 'http://localhost:8899/wp-content/uploads/poster.jpg',
          },
        ],
        author: [{ id: 1, name: 'admin' }],
        'wp:lock': [{ locked: true, time: '1628506372', user: 1 }],
        'wp:lockuser': [
          {
            id: 1,
            name: 'admin',
            url: 'http://localhost:8899',
            description: '',
            link: 'http://localhost:8899/author/admin',
          },
        ],
      },
    };

    const reshapedObj = reshapeStoryObject(responseObj);
    expect(reshapedObj).toMatchObject({
      author: {
        name: 'admin',
        id: 1,
      },
      bottomTargetAction: 'http://localhost:8899/edit/27',
      created: '2020-03-26T20:57:24',
      createdGmt: 'undefinedZ',
      editStoryLink: 'http://localhost:8899/edit/27',
      featuredMediaUrl: 'http://localhost:8899/wp-content/uploads/poster.jpg',
      id: 27,
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      lockUser: {
        avatar: null,
        id: 1,
        name: 'admin',
      },
      locked: true,
      modified: '2020-03-26T21:42:14',
      modifiedGmt: 'undefinedZ',
      previewLink: 'http://localhost:8899/preview/27',
      status: 'draft',
      title: 'Carlos Draft',
    });
  });

  it('should return null if the ID is missing', () => {
    const responseObj = {
      date: '2020-03-26T20:57:24',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=27',
      },
      modified: '2020-03-26T21:42:14',
      slug: '',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      title: { raw: 'Carlos Draft' },
      excerpt: { rendered: '', protected: false },
      author: 1,
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      meta: {
        web_stories_poster: {},
      },
      _embedded: {
        'wp:featuredmedia': [{ id: 0, source_url: '' }],
        author: [{ id: 1, name: 'admin' }],
      },
    };

    const reshapedObj = reshapeStoryObject(responseObj);
    expect(reshapedObj).toBeNull();
  });

  it('should return capabilities', () => {
    const responseObj = {
      id: 27,
      date: '2020-03-26T20:57:24',
      guid: {
        rendered: 'http://localhost:8899/?post_type=web-story&#038;p=27',
      },
      modified: '2020-03-26T21:42:14',
      slug: '',
      status: 'draft',
      type: 'web-story',
      link: 'http://localhost:8899/?post_type=web-story&p=27',
      title: { raw: 'Carlos Draft' },
      excerpt: { rendered: '', protected: false },
      author: 1,
      featured_media: 0,
      template: '',
      categories: [],
      tags: [],
      meta: {
        web_stories_poster: {},
      },
      _embedded: {
        'wp:featuredmedia': [{ id: 0, source_url: '' }],
        author: [{ id: 1, name: 'admin' }],
      },
      _links: {
        [REST_LINKS.EDIT]: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
        [REST_LINKS.DELETE]: [
          {
            href: 'http://localhost:8899/wp-json/web-stories/v1/web-story/163',
          },
        ],
      },
    };

    const reshapedObj = reshapeStoryObject(responseObj);
    expect(reshapedObj.capabilities.hasDeleteAction).toBeTrue();
    expect(reshapedObj.capabilities.hasEditAction).toBeTrue();
  });
});
