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
import getResourceFromMedia3p from '../getResourceFromMedia3p';

describe('getResourceFromMedia3p', () => {
  it('should return video resource', () => {
    const media3pResource = {
      color: '#00379b',
      name: 'media/coverr:g9re0sRUYA',
      provider: 'COVERR',
      type: 'VIDEO',
      description: 'NYC Postcard',
      created_at: '',
      createTime: '2018-09-25T20:03.07Z',
      updateTime: '2019-05-20T22:49.08Z',
      imageUrls: [
        {
          url: 'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 640,
          height: 1138,
        },
        {
          url: 'https://storage.coverr.co/p/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 1080,
          height: 1920,
        },
      ],
      videoUrls: [
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 360,
          height: 640,
        },
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
      ],
      videoMetadata: {
        duration: '121.0000001s',
      },
    };
    const expectedStoryEditorResource = {
      baseColor: '#00379b',
      blurHash: undefined,
      type: 'video',
      mimeType: 'video/mp4',
      creationDate: '2018-09-25T20:03.07Z',
      src: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
      width: 1080,
      height: 1920,
      poster:
        'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
      posterId: 'media/coverr:g9re0sRUYA',
      id: 'media/coverr:g9re0sRUYA',
      length: 121,
      lengthFormatted: '2:01',
      alt: 'NYC Postcard',
      isPlaceholder: false,
      isMuted: true,
      isOptimized: true,
      isExternal: true,
      needsProxy: false,
      sizes: {
        full: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
        preview: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 360,
          height: 640,
        },
      },
      attribution: undefined,
      output: undefined,
      trimData: undefined,
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });

  it('should return video resource no description', () => {
    const media3pResource = {
      color: '#00379b',
      name: 'media/coverr:g9re0sRUYA',
      provider: 'COVERR',
      type: 'VIDEO',
      title: 'Test title',
      created_at: '',
      createTime: '2018-09-25T20:03.07Z',
      updateTime: '2019-05-20T22:49.08Z',
      imageUrls: [
        {
          url: 'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 640,
          height: 1138,
        },
        {
          url: 'https://storage.coverr.co/p/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 1080,
          height: 1920,
        },
      ],
      videoUrls: [
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 360,
          height: 640,
        },
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
      ],
      videoMetadata: {
        duration: '121.0000001s',
      },
    };
    const expectedStoryEditorResource = {
      baseColor: '#00379b',
      blurHash: undefined,
      type: 'video',
      mimeType: 'video/mp4',
      creationDate: '2018-09-25T20:03.07Z',
      src: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
      width: 1080,
      height: 1920,
      poster:
        'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
      posterId: 'media/coverr:g9re0sRUYA',
      id: 'media/coverr:g9re0sRUYA',
      length: 121,
      lengthFormatted: '2:01',
      alt: 'Test title',
      isPlaceholder: false,
      isMuted: true,
      isOptimized: true,
      isExternal: true,
      needsProxy: false,
      sizes: {
        full: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
        preview: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 360,
          height: 640,
        },
      },
      attribution: undefined,
      output: undefined,
      trimData: undefined,
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });

  it('should return video resource no description or title', () => {
    const media3pResource = {
      color: '#00379b',
      name: 'media/coverr:g9re0sRUYA',
      provider: 'COVERR',
      type: 'VIDEO',
      created_at: '',
      createTime: '2018-09-25T20:03.07Z',
      updateTime: '2019-05-20T22:49.08Z',
      imageUrls: [
        {
          url: 'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 640,
          height: 1138,
        },
        {
          url: 'https://storage.coverr.co/p/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 1080,
          height: 1920,
        },
      ],
      videoUrls: [
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 360,
          height: 640,
        },
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
      ],
      videoMetadata: {
        duration: '121.0000001s',
      },
    };
    const expectedStoryEditorResource = {
      baseColor: '#00379b',
      blurHash: undefined,
      type: 'video',
      mimeType: 'video/mp4',
      creationDate: '2018-09-25T20:03.07Z',
      src: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
      width: 1080,
      height: 1920,
      poster:
        'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
      posterId: 'media/coverr:g9re0sRUYA',
      id: 'media/coverr:g9re0sRUYA',
      length: 121,
      lengthFormatted: '2:01',
      alt: 'media/coverr:g9re0sRUYA',
      isPlaceholder: false,
      isMuted: true,
      isOptimized: true,
      isExternal: true,
      needsProxy: false,
      sizes: {
        full: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
        preview: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 360,
          height: 640,
        },
      },
      attribution: undefined,
      output: undefined,
      trimData: undefined,
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });

  it('should return video resource with calculated size', () => {
    const media3pResource = {
      color: '#00379b',
      name: 'media/coverr:g9re0sRUYA',
      provider: 'COVERR',
      type: 'VIDEO',
      description: 'NYC Postcard',
      created_at: '',
      createTime: '2018-09-25T20:03.07Z',
      updateTime: '2019-05-20T22:49.08Z',
      imageUrls: [
        {
          url: 'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
        },
        {
          url: 'https://storage.coverr.co/p/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 1080,
          height: 1920,
        },
      ],
      videoUrls: [
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
        },
        {
          url: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
      ],
      videoMetadata: {
        duration: '121.0000001s',
      },
    };
    const expectedStoryEditorResource = {
      baseColor: '#00379b',
      blurHash: undefined,
      type: 'video',
      mimeType: 'video/mp4',
      creationDate: '2018-09-25T20:03.07Z',
      src: 'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
      width: 1080,
      height: 1920,
      poster:
        'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
      posterId: 'media/coverr:g9re0sRUYA',
      id: 'media/coverr:g9re0sRUYA',
      length: 121,
      lengthFormatted: '2:01',
      alt: 'NYC Postcard',
      isPlaceholder: false,
      isMuted: true,
      isOptimized: true,
      isExternal: true,
      needsProxy: false,
      sizes: {
        full: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 1080,
          height: 1920,
        },
        preview: {
          file: 'media/coverr:g9re0sRUYA',
          sourceUrl:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 640,
          height: 1137.7777777777778,
        },
      },
      trimData: undefined,
      attribution: undefined,
      output: undefined,
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });

  it('should throw when unsplash has no size', () => {
    const media3pResource = {
      name: 'media/unsplash:dpbXgTh0Lac',
      provider: 'UNSPLASH',
      type: 'IMAGE',
      author: {
        displayName: 'XPS',
        url: 'https://unsplash.com/@xps?utm_source=web_stories_wordpress&utm_medium=referral',
      },
      createTime: '2020-07-01T22:30:13Z',
      updateTime: '2020-08-14T05:05:24Z',
      registerUsageUrl:
        'https://autopush-media3p.sandbox.googleapis.com/v1/media:registerUsage?payload=Af81gfyYynHd3Ao2kDkRmfXj7GcpvUB%2BodPzTbGSxvbLB1PmyrpJV4O1IbvAaUFKdHS1QhGxHlTRbkaR1/phBTcevwOmt7yMmwhUsmaNQiTRmTImxIr9NRMBWP6YyGLY/TaoLTyuRBlH5A%3D%3D',
      imageUrls: [
        {
          url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=6016&h=4016&fit=max',
          mimeType: 'image/jpeg',
          width: 6016,
          height: 4016,
        },
        {
          url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=4812&h=3212&fit=max',
          mimeType: 'image/jpeg',
          width: 4812,
          height: 3212,
        },
        {
          url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=3609&h=2409&fit=max',
          mimeType: 'image/jpeg',
          width: 3609,
          height: 2409,
        },
        {
          url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=2406&h=1606&fit=max',
          mimeType: 'image/jpeg',
          width: 2406,
          height: 1606,
        },
        {
          url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=1203&h=803&fit=max',
          mimeType: 'image/jpeg',
          width: 1203,
          height: 803,
        },
        {
          url: 'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=340&h=227&fit=max',
          mimeType: 'image/jpeg',
        },
      ],
    };
    expect(() => getResourceFromMedia3p(media3pResource)).toThrow(
      'Missing width and height for: ' + media3pResource
    );
  });

  it('should return image and video resources for tenor gifs', () => {
    const media3pResource = {
      color: '#00379b',
      name: 'media/tenor:3468838096637910112',
      provider: 'TENOR',
      type: 'GIF',
      author: {},
      createTime: '2020-10-26T21:36:35Z',
      registerUsageUrl:
        'https://media3p.googleapis.com/v1/media:registerUsage?token=ASGVQQM7RDo11b9csHFps5CdRRojuc3hJdc5cgBr817EXo%2B4oHZyK/RIyx4%2Bko/WHVgHwgBx1wThYyUgljKneqDEakyl0A%3D%3D',
      imageUrls: [
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAAC/happy-national-cat-day-peace.gif',
          imageName: 'gif',
          mimeType: 'image/gif',
          width: 498,
          height: 498,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAAe/happy-national-cat-day-peace.png',
          imageName: 'gifpreview',
          mimeType: 'image/gif',
          width: 640,
          height: 640,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAAM/happy-national-cat-day-peace.gif',
          imageName: 'tinygif',
          mimeType: 'image/gif',
          width: 220,
          height: 220,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAAS/happy-national-cat-day-peace.gif',
          imageName: 'nanogif',
          mimeType: 'image/gif',
          width: 90,
          height: 90,
        },
      ],
      videoUrls: [
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAPs/happy-national-cat-day-peace.webm',
          videoName: 'webm',
          mimeType: 'image/webm',
          width: 640,
          height: 640,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAPo/happy-national-cat-day-peace.mp4',
          videoName: 'mp4',
          mimeType: 'video/mp4',
          width: 640,
          height: 640,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAP3/happy-national-cat-day-peace.webm',
          videoName: 'tinywebm',
          mimeType: 'image/webm',
          width: 186,
          height: 186,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAP1/happy-national-cat-day-peace.mp4',
          videoName: 'tinymp4',
          mimeType: 'video/mp4',
          width: 186,
          height: 186,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAP4/happy-national-cat-day-peace.webm',
          videoName: 'nanowebm',
          mimeType: 'image/webm',
          width: 86,
          height: 86,
        },
        {
          url: 'https://c.tenor.com/MCPJ3sVx3GAAAAP2/happy-national-cat-day-peace.mp4',
          videoName: 'nanomp4',
          mimeType: 'video/mp4',
          width: 86,
          height: 86,
        },
      ],
      videoMetadata: {
        duration: '0s',
      },
    };

    const expectedStoryEditorResource = {
      baseColor: '#00379b',
      blurHash: undefined,
      id: 'media/tenor:3468838096637910112',
      length: undefined,
      lengthFormatted: undefined,
      type: 'gif',
      mimeType: 'image/gif',
      creationDate: '2020-10-26T21:36:35Z',
      src: 'https://c.tenor.com/MCPJ3sVx3GAAAAAC/happy-national-cat-day-peace.gif',
      width: 498,
      height: 498,
      alt: 'media/tenor:3468838096637910112',
      isPlaceholder: false,
      isMuted: false,
      isOptimized: true,
      isExternal: true,
      needsProxy: false,
      trimData: undefined,
      poster:
        'https://c.tenor.com/MCPJ3sVx3GAAAAAe/happy-national-cat-day-peace.png',
      posterId: 'media/tenor:3468838096637910112',
      sizes: {
        full: {
          file: 'media/tenor:3468838096637910112',
          height: 498,
          mimeType: 'image/gif',
          sourceUrl:
            'https://c.tenor.com/MCPJ3sVx3GAAAAAC/happy-national-cat-day-peace.gif',
          width: 498,
        },
        large: {
          file: 'media/tenor:3468838096637910112',
          height: 220,
          mimeType: 'image/gif',
          sourceUrl:
            'https://c.tenor.com/MCPJ3sVx3GAAAAAM/happy-national-cat-day-peace.gif',
          width: 220,
        },
        web_stories_thumbnail: {
          file: 'media/tenor:3468838096637910112',
          height: 90,
          mimeType: 'image/gif',
          sourceUrl:
            'https://c.tenor.com/MCPJ3sVx3GAAAAAS/happy-national-cat-day-peace.gif',
          width: 90,
        },
      },
      output: {
        mimeType: 'video/mp4',
        src: 'https://c.tenor.com/MCPJ3sVx3GAAAAPo/happy-national-cat-day-peace.mp4',
      },
      attribution: {
        author: {
          displayName: undefined,
          url: undefined,
        },
        registerUsageUrl:
          'https://media3p.googleapis.com/v1/media:registerUsage?token=ASGVQQM7RDo11b9csHFps5CdRRojuc3hJdc5cgBr817EXo%2B4oHZyK/RIyx4%2Bko/WHVgHwgBx1wThYyUgljKneqDEakyl0A%3D%3D',
      },
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });

  it('should return sticker resource', () => {
    const media3pResource = {
      name: 'media/tenor:7259408917338674423',
      provider: 'TENOR',
      type: 'STICKER',
      author: {
        displayName: 'tenor',
        url: 'https://tenor.com/official/tenor',
      },
      title: 'Tuesday Happy Tuesday Sticker',
      createTime: '2020-09-14T18:44:39Z',
      registerUsageUrl:
        'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE%2Blc8Z9N5qFNkRHgYpJLI9SgPhj7JhlSjmK7Fy6OABL6uRP0NXphMGvHFqDrhfhHQaVI3CLXT3Qsz6xDyjN/dV2AA%3D%3D',
      imageUrls: [
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAl/tuesday-happy-tuesday.webp',
          imageName: 'webp_transparent',
          mimeType: 'image/webp',
          width: 498,
          height: 303,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAt/tuesday-happy-tuesday.webp',
          imageName: 'webppreview_transparent',
          mimeType: 'image/webp',
          width: 498,
          height: 303,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAi/tuesday-happy-tuesday.gif',
          imageName: 'gif_transparent',
          mimeType: 'image/gif',
          width: 498,
          height: 286,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAq/tenor.gif',
          imageName: 'gifpreview_transparent',
          mimeType: 'image/gif',
          width: 498,
          height: 286,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAm/tuesday-happy-tuesday.webp',
          imageName: 'tinywebp_transparent',
          mimeType: 'image/webp',
          width: 200,
          height: 122,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAj/tuesday-happy-tuesday.gif',
          imageName: 'tinygif_transparent',
          mimeType: 'image/gif',
          width: 200,
          height: 115,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAn/tuesday-happy-tuesday.webp',
          imageName: 'nanowebp_transparent',
          mimeType: 'image/webp',
          width: 90,
          height: 55,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAk/tuesday-happy-tuesday.gif',
          imageName: 'nanogif_transparent',
          mimeType: 'image/gif',
          width: 90,
          height: 52,
        },
      ],
      videoUrls: [
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAPs/tuesday-happy-tuesday.webm',
          videoName: 'webm',
          mimeType: 'image/webm',
          width: 640,
          height: 388,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAPo/tuesday-happy-tuesday.mp4',
          videoName: 'mp4',
          mimeType: 'video/mp4',
          width: 640,
          height: 388,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAP3/tuesday-happy-tuesday.webm',
          videoName: 'tinywebm',
          mimeType: 'image/webm',
          width: 258,
          height: 156,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAP1/tuesday-happy-tuesday.mp4',
          videoName: 'tinymp4',
          mimeType: 'video/mp4',
          width: 258,
          height: 156,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAP4/tuesday-happy-tuesday.webm',
          videoName: 'nanowebm',
          mimeType: 'image/webm',
          width: 120,
          height: 72,
        },
        {
          url: 'https://c.tenor.com/ZL6Z8sVGVPcAAAP2/tuesday-happy-tuesday.mp4',
          videoName: 'nanomp4',
          mimeType: 'video/mp4',
          width: 120,
          height: 72,
        },
      ],
      videoMetadata: {
        duration: '0s',
      },
    };
    const expectedStoryEditorResource = {
      baseColor: undefined,
      blurHash: undefined,
      length: undefined,
      lengthFormatted: undefined,
      type: 'image',
      mimeType: 'image/gif',
      creationDate: '2020-09-14T18:44:39Z',
      src: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAi/tuesday-happy-tuesday.gif',
      width: 498,
      height: 286,
      id: 'media/tenor:7259408917338674423',
      alt: 'Tuesday Happy Tuesday Sticker',
      isPlaceholder: false,
      isMuted: false,
      isOptimized: false,
      isExternal: true,
      needsProxy: false,
      output: undefined,
      poster: undefined,
      posterId: undefined,
      sizes: {
        '200_115': {
          file: 'media/tenor:7259408917338674423',
          height: 115,
          mimeType: 'image/gif',
          sourceUrl:
            'https://c.tenor.com/ZL6Z8sVGVPcAAAAj/tuesday-happy-tuesday.gif',
          width: 200,
        },
        full: {
          file: 'media/tenor:7259408917338674423',
          height: 286,
          mimeType: 'image/gif',
          sourceUrl:
            'https://c.tenor.com/ZL6Z8sVGVPcAAAAi/tuesday-happy-tuesday.gif',
          width: 498,
        },
        large: {
          file: 'media/tenor:7259408917338674423',
          height: 286,
          mimeType: 'image/gif',
          sourceUrl: 'https://c.tenor.com/ZL6Z8sVGVPcAAAAq/tenor.gif',
          width: 498,
        },
        web_stories_thumbnail: {
          file: 'media/tenor:7259408917338674423',
          height: 52,
          mimeType: 'image/gif',
          sourceUrl:
            'https://c.tenor.com/ZL6Z8sVGVPcAAAAk/tuesday-happy-tuesday.gif',
          width: 90,
        },
      },
      attribution: {
        author: {
          displayName: 'tenor',
          url: 'https://tenor.com/official/tenor',
        },
        registerUsageUrl:
          'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE%2Blc8Z9N5qFNkRHgYpJLI9SgPhj7JhlSjmK7Fy6OABL6uRP0NXphMGvHFqDrhfhHQaVI3CLXT3Qsz6xDyjN/dV2AA%3D%3D',
      },

      trimData: undefined,
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });
});
