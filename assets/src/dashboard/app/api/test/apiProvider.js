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
import { renderHook, act } from '@testing-library/react-hooks';
import { useContext } from 'react';
import ApiProvider, { ApiContext, reshapeStoryObject } from '../apiProvider';
import { ConfigProvider } from '../../config';

jest.mock('../wpAdapter', () => ({
  get: () =>
    Promise.resolve({
      headers: {
        get: () => '1',
      },
      json: () =>
        Promise.resolve([
          {
            id: 123,
            status: 'published',
            title: { rendered: 'Carlos', raw: 'Carlos' },
            story_data: { pages: [{ id: 1, elements: [] }] },
            modified: '1970-01-01T00:00:00.000Z',
          },
        ]),
    }),
  post: (path, { data }) =>
    Promise.resolve({
      id: data.id,
      status: 'published',
      title: { rendered: data.title, raw: data.title },
      story_data: { pages: [{ id: 1, elements: [] }] },
      modified: '1970-01-01T00:00:00.000Z',
    }),
}));

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

    const reshapedObj = reshapeStoryObject('http://editstory.com?action=edit')(
      responseObj
    );

    expect(reshapedObj).toMatchObject({
      id: 27,
      title: 'Carlos Draft',
      status: 'draft',
      modified: moment('2020-03-26T21:42:14'),
      pages: [{ id: 0, elements: [] }],
      centerTargetAction: '',
      bottomTargetAction: 'http://editstory.com?action=edit&post=27',
    });
  });

  it('should return null if the ID is missing', () => {
    const responseObj = {
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

    const reshapedObj = reshapeStoryObject('http://editstory.com?action=edit')(
      responseObj
    );
    expect(reshapedObj).toBeNull();
  });

  it('should return null if the story has no pages', () => {
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
      story_data: { pages: [] },
    };

    const reshapedObj = reshapeStoryObject('http://editstory.com?action=edit')(
      responseObj
    );
    expect(reshapedObj).toBeNull();
  });
});

describe('ApiProvider', () => {
  it('should return a story in state data when the API request is fired', async () => {
    const { result } = renderHook(() => useContext(ApiContext), {
      // eslint-disable-next-line react/display-name
      wrapper: (props) => (
        <ConfigProvider
          config={{ api: { stories: 'stories' }, editStoryURL: 'editStory' }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.fetchStories({});
    });

    expect(result.current.state.stories).toStrictEqual({
      '123': {
        bottomTargetAction: 'editStory&post=123',
        centerTargetAction: '',
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'published',
        title: 'Carlos',
      },
    });
  });

  it('should return an updated story in state data when the API request is fired', async () => {
    const { result } = renderHook(() => useContext(ApiContext), {
      // eslint-disable-next-line react/display-name
      wrapper: (props) => (
        <ConfigProvider
          config={{ api: { stories: 'stories' }, editStoryURL: 'editStory' }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    await act(async () => {
      await result.current.actions.fetchStories({});
    });

    await act(async () => {
      await result.current.actions.updateStory({
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'published',
        title: 'New Title',
      });
    });

    expect(result.current.state.stories).toStrictEqual({
      '123': {
        bottomTargetAction: 'editStory&post=123',
        centerTargetAction: '',
        id: 123,
        modified: moment('1970-01-01T00:00:00.000Z'),
        pages: [
          {
            elements: [],
            id: 1,
          },
        ],
        status: 'published',
        title: 'New Title',
      },
    });
  });
});
