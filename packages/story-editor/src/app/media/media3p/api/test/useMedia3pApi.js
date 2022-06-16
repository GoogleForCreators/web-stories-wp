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
import { renderHook } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { useMedia3pApi } from '..';
import Media3pApiProvider from '../media3pApiProvider';

jest.mock('../apiFetcher');

import apiFetcherMock, { API_DOMAIN, Paths } from '../apiFetcher';

const REGISTER_USAGE_URL =
  API_DOMAIN +
  Paths.REGISTER_USAGE +
  '?payload=02647749feef0d5536c92df1d9cfa38e';

/* eslint-disable testing-library/no-node-access */

describe('useMedia3pApi', () => {
  beforeAll(() => {
    apiFetcherMock.listMedia.mockImplementation(() =>
      Promise.resolve({
        media: [
          {
            name: 'media/unsplash:1234',
            provider: 'UNSPLASH',
            author: {
              displayName: 'Maria',
              url: 'http://maria.com',
            },
            registerUsageUrl: REGISTER_USAGE_URL,
            imageUrls: [
              {
                url: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=340&h=227&fit=max',
                mimeType: 'image/jpeg',
                width: 340,
                height: 227,
              },
              {
                url: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=1060&h=707&fit=max',
                mimeType: 'image/jpeg',
                width: 1060,
                height: 707,
              },
              {
                url: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=2121&h=1414&fit=max',
                mimeType: 'image/jpeg',
                width: 2121,
                height: 1414,
              },
              {
                url: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=3182&h=2121&fit=max',
                mimeType: 'image/jpeg',
                width: 3182,
                height: 2121,
              },
              {
                url: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=4243&h=2829&fit=max',
                mimeType: 'image/jpeg',
                width: 4243,
                height: 2829,
              },
              {
                url: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=5304&h=3536&fit=max',
                mimeType: 'image/jpeg',
                width: 5304,
                height: 3536,
              },
            ],
            description: 'A cat',
            type: 'IMAGE',
            createTime: '1234',
            updateTime: '5678',
          },
        ],
        nextPageToken: 'lala',
      })
    );
    apiFetcherMock.listCategories.mockImplementation(() =>
      Promise.resolve({
        categories: [
          {
            name: 'categories/unsplash:1',
            displayName: 'Covid-19',
          },
          {
            name: 'categories/unsplash:2',
            displayName: 'Mountains',
          },
        ],
      })
    );
    apiFetcherMock.registerUsage.mockImplementation(() =>
      Promise.resolve(undefined)
    );
  });

  it('should properly call listMedia and map the results', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    const listMediaResult = await result.current.actions.listMedia({
      provider: 'unsplash',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash',
      orderBy: undefined,
      pageSize: 20,
      pageToken: undefined,
    });
    expect(listMediaResult).toStrictEqual({
      media: [
        {
          baseColor: undefined,
          blurHash: undefined,
          alt: 'A cat',
          attribution: {
            author: {
              displayName: 'Maria',
              url: 'http://maria.com',
            },
            registerUsageUrl: REGISTER_USAGE_URL,
          },
          creationDate: '1234',
          height: 3536,
          id: 'media/unsplash:1234',
          length: undefined,
          lengthFormatted: undefined,
          isPlaceholder: false,
          isMuted: false,
          isOptimized: false,
          isExternal: true,
          needsProxy: false,
          mimeType: 'image/jpeg',
          output: undefined,
          poster: undefined,
          posterId: undefined,
          sizes: {
            web_stories_thumbnail: {
              file: 'media/unsplash:1234',
              sourceUrl:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=340&h=227&fit=max',
              mimeType: 'image/jpeg',
              width: 340,
              height: 227,
            },
            '1060_707': {
              file: 'media/unsplash:1234',
              sourceUrl:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=1060&h=707&fit=max',
              mimeType: 'image/jpeg',
              width: 1060,
              height: 707,
            },
            '2121_1414': {
              file: 'media/unsplash:1234',
              sourceUrl:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=2121&h=1414&fit=max',
              mimeType: 'image/jpeg',
              width: 2121,
              height: 1414,
            },
            '3182_2121': {
              file: 'media/unsplash:1234',
              sourceUrl:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=3182&h=2121&fit=max',
              mimeType: 'image/jpeg',
              width: 3182,
              height: 2121,
            },
            large: {
              file: 'media/unsplash:1234',
              sourceUrl:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=4243&h=2829&fit=max',
              mimeType: 'image/jpeg',
              width: 4243,
              height: 2829,
            },
            full: {
              file: 'media/unsplash:1234',
              sourceUrl:
                'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=5304&h=3536&fit=max',
              mimeType: 'image/jpeg',
              width: 5304,
              height: 3536,
            },
          },
          src: 'https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=5304&h=3536&fit=max',
          trimData: undefined,
          type: 'image',
          width: 5304,
        },
      ],
      nextPageToken: 'lala',
    });
  });

  it('should call listMedia with searchTerm', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      filter: { searchTerm: 'cat' },
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash cat',
      orderBy: undefined,
      pageSize: 20,
      pageToken: undefined,
    });
  });

  it('should call listMedia with category', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      filter: { categoryId: 'category/1' },
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash category:category/1',
      orderBy: undefined,
      pageSize: 20,
      pageToken: undefined,
    });
  });

  it('should call listMedia with contentType', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'tenor',
      filter: {
        contentType: 'gif',
        searchTerm: 'cat',
      },
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:tenor type:gif cat',
      orderBy: undefined,
      pageSize: 20,
      pageToken: undefined,
    });
  });

  it('should call listMedia with pageToken', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      pageToken: 'token',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash',
      orderBy: undefined,
      pageSize: 20,
      pageToken: 'token',
    });
  });

  it('should call listMedia with orderBy', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    await result.current.actions.listMedia({
      provider: 'unsplash',
      orderBy: 'latest',
    });

    expect(apiFetcherMock.listMedia).toHaveBeenCalledWith({
      filter: 'provider:unsplash',
      orderBy: 'latest',
      pageSize: 20,
      pageToken: undefined,
    });
  });

  it('should properly call listCategories and map the results', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    const listCategoriesResult = await result.current.actions.listCategories({
      provider: 'unsplash',
    });

    expect(listCategoriesResult).toStrictEqual({
      categories: [
        {
          id: 'categories/unsplash:1',
          label: 'Covid-19',
        },
        {
          id: 'categories/unsplash:2',
          label: 'Mountains',
        },
      ],
    });
  });

  it('should properly call registerUsage', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    const registerUsageResult = await result.current.actions.registerUsage({
      registerUsageUrl: REGISTER_USAGE_URL,
    });

    expect(registerUsageResult).toBeUndefined();
  });

  it('should properly handle an empty listMedia response', () => {
    apiFetcherMock.listMedia.mockImplementation(() => Promise.resolve({}));
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );

    expect(async () => {
      await renderHook(() => useMedia3pApi(), { wrapper });
    }).not.toThrow();
  });
});

/* eslint-enable testing-library/no-node-access */
