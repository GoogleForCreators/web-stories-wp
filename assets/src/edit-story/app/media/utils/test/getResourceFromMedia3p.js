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
      name: 'media/coverr:g9re0sRUYA',
      provider: 'COVERR',
      type: 'VIDEO',
      description: 'NYC Postcard',
      created_at: '',
      createTime: '2018-09-25T20:03.07Z',
      updateTime: '2019-05-20T22:49.08Z',
      imageUrls: [
        {
          url:
            'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 640,
          height: 1138,
        },
        {
          url:
            'https://storage.coverr.co/p/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 1080,
          height: 1920,
        },
      ],
      videoUrls: [
        {
          url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
          width: 360,
          height: 640,
        },
        {
          url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
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
      type: 'video',
      mimeType: 'video/mp4',
      creationDate: '2018-09-25T20:03.07Z',
      src:
        'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
      width: 1080,
      height: 1920,
      poster:
        'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
      posterId: undefined,
      id: 'media/coverr:g9re0sRUYA',
      length: 121,
      lengthFormatted: '2:01',
      title: 'NYC Postcard',
      alt: null,
      local: false,
      sizes: {
        full: {
          file: 'media/coverr:g9re0sRUYA',
          source_url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mime_type: 'video/mp4',
          width: 1080,
          height: 1920,
        },
        preview: {
          file: 'media/coverr:g9re0sRUYA',
          source_url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mime_type: 'video/mp4',
          width: 360,
          height: 640,
        },
      },
      attribution: undefined,
      output: undefined,
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });

  it('should return video resource with calculated size', () => {
    const media3pResource = {
      name: 'media/coverr:g9re0sRUYA',
      provider: 'COVERR',
      type: 'VIDEO',
      description: 'NYC Postcard',
      created_at: '',
      createTime: '2018-09-25T20:03.07Z',
      updateTime: '2019-05-20T22:49.08Z',
      imageUrls: [
        {
          url:
            'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
        },
        {
          url:
            'https://storage.coverr.co/p/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
          mimeType: 'image/jpeg',
          width: 1080,
          height: 1920,
        },
      ],
      videoUrls: [
        {
          url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mimeType: 'video/mp4',
        },
        {
          url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
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
      type: 'video',
      mimeType: 'video/mp4',
      creationDate: '2018-09-25T20:03.07Z',
      src:
        'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
      width: 1080,
      height: 1920,
      poster:
        'https://storage.coverr.co/t/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?v=1596077699474',
      posterId: undefined,
      id: 'media/coverr:g9re0sRUYA',
      length: 121,
      lengthFormatted: '2:01',
      title: 'NYC Postcard',
      alt: null,
      local: false,
      sizes: {
        full: {
          file: 'media/coverr:g9re0sRUYA',
          source_url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mime_type: 'video/mp4',
          width: 1080,
          height: 1920,
        },
        preview: {
          file: 'media/coverr:g9re0sRUYA',
          source_url:
            'https://storage.coverr.co/videos/Y5RaHMvC502h001U003e3YbypqDJdjEMOaT/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjIzQ0I1QURCMjc3QTk2RTc4MTBBIiwiaWF0IjoxNTk2MDc3Njk5fQ.hfcLRuoZqXwJiZtgv40MI-hS3cMlzhbwNIEvNKtTXNw',
          mime_type: 'video/mp4',
          width: 640,
          height: 1137.7777777777778,
        },
      },
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
        url:
          'https://unsplash.com/@xps?utm_source=web_stories_wordpress&utm_medium=referral',
      },
      createTime: '2020-07-01T22:30:13Z',
      updateTime: '2020-08-14T05:05:24Z',
      registerUsageUrl:
        'https://autopush-media3p.sandbox.googleapis.com/v1/media:registerUsage?payload=Af81gfyYynHd3Ao2kDkRmfXj7GcpvUB%2BodPzTbGSxvbLB1PmyrpJV4O1IbvAaUFKdHS1QhGxHlTRbkaR1/phBTcevwOmt7yMmwhUsmaNQiTRmTImxIr9NRMBWP6YyGLY/TaoLTyuRBlH5A%3D%3D',
      imageUrls: [
        {
          url:
            'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=6016&h=4016&fit=max',
          mimeType: 'image/jpeg',
          width: 6016,
          height: 4016,
        },
        {
          url:
            'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=4812&h=3212&fit=max',
          mimeType: 'image/jpeg',
          width: 4812,
          height: 3212,
        },
        {
          url:
            'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=3609&h=2409&fit=max',
          mimeType: 'image/jpeg',
          width: 3609,
          height: 2409,
        },
        {
          url:
            'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=2406&h=1606&fit=max',
          mimeType: 'image/jpeg',
          width: 2406,
          height: 1606,
        },
        {
          url:
            'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=1203&h=803&fit=max',
          mimeType: 'image/jpeg',
          width: 1203,
          height: 803,
        },
        {
          url:
            'https://images.unsplash.com/photo-1593642532400-2682810df593?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEzNzE5M30&fm=jpg&w=340&h=227&fit=max',
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
      name: 'media/tenor:6669065364376864993',
      provider: 'TENOR',
      type: 'GIF',
      author: {},
      createTime: '2020-06-01T03:08:24Z',
      registerUsageUrl:
        'https://media3p.googleapis.com/v1/media:registerUsage?token=AX7RMSfLAN8%2B70jpJTvTsQaIeuf5MlhFyWIq54rLC3vULzHC8OeNIaaEreXEvbUkaevy61VVi4LYPLLjhmgIjHZfkHCv3Q%3D%3D',
      imageUrls: [
        {
          url:
            'https://c.tenor.com/XI1HnVuLSOEAAAAC/still-here-are-you-still-here.gif',
          imageName: 'gif',
          mimeType: 'image/gif',
          width: 498,
          height: 371,
        },
        {
          url:
            'https://c.tenor.com/XI1HnVuLSOEAAAAM/still-here-are-you-still-here.gif',
          imageName: 'tinygif',
          mimeType: 'image/gif',
          width: 220,
          height: 164,
        },
        {
          url:
            'https://c.tenor.com/XI1HnVuLSOEAAAAS/still-here-are-you-still-here.gif',
          imageName: 'nanogif',
          mimeType: 'image/gif',
          width: 121,
          height: 90,
        },
      ],
      videoUrls: [
        {
          url:
            'https://media.tenor.com/videos/e2f95cb962325e9cf058bec8ec565476/webm',
          videoName: 'webm',
          mimeType: 'image/webm',
          width: 640,
          height: 478,
        },
        {
          url:
            'https://c.tenor.com/XI1HnVuLSOEAAAPo/still-here-are-you-still-here.mp4',
          videoName: 'mp4',
          mimeType: 'video/mp4',
          width: 640,
          height: 478,
        },
        {
          url:
            'https://media.tenor.com/videos/317ba641fbe9731c70e49eb5dfbf23f3/webm',
          videoName: 'tinywebm',
          mimeType: 'image/webm',
          width: 320,
          height: 238,
        },
        {
          url:
            'https://c.tenor.com/XI1HnVuLSOEAAAP1/still-here-are-you-still-here.mp4',
          videoName: 'tinymp4',
          mimeType: 'video/mp4',
          width: 320,
          height: 238,
        },
        {
          url:
            'https://media.tenor.com/videos/1511f3558f31d1ea13231b2be3b44b6c/webm',
          videoName: 'nanowebm',
          mimeType: 'image/webm',
          width: 150,
          height: 112,
        },
        {
          url:
            'https://c.tenor.com/XI1HnVuLSOEAAAP2/still-here-are-you-still-here.mp4',
          videoName: 'nanomp4',
          mimeType: 'video/mp4',
          width: 150,
          height: 112,
        },
      ],
      videoMetadata: {
        duration: '0s',
      },
    };

    const expectedStoryEditorResource = {
      id: undefined,
      length: undefined,
      lengthFormatted: undefined,
      type: 'gif',
      mimeType: 'image/gif',
      creationDate: '2020-06-01T03:08:24Z',
      src:
        'https://c.tenor.com/XI1HnVuLSOEAAAAC/still-here-are-you-still-here.gif',
      width: 498,
      height: 371,
      title: undefined,
      alt: null,
      local: false,
      poster: undefined,
      posterId: undefined,
      sizes: {
        full: {
          file: 'media/tenor:6669065364376864993',
          height: 371,
          mime_type: 'image/gif',
          source_url:
            'https://c.tenor.com/XI1HnVuLSOEAAAAC/still-here-are-you-still-here.gif',
          width: 498,
        },
        large: {
          file: 'media/tenor:6669065364376864993',
          height: 164,
          mime_type: 'image/gif',
          source_url:
            'https://c.tenor.com/XI1HnVuLSOEAAAAM/still-here-are-you-still-here.gif',
          width: 220,
        },
        web_stories_thumbnail: {
          file: 'media/tenor:6669065364376864993',
          height: 90,
          mime_type: 'image/gif',
          source_url:
            'https://c.tenor.com/XI1HnVuLSOEAAAAS/still-here-are-you-still-here.gif',
          width: 121,
        },
      },
      output: {
        mimeType: 'video/mp4',
        sizes: {
          mp4: {
            full: {
              file: 'media/tenor:6669065364376864993',
              height: 478,
              mime_type: 'video/mp4',
              source_url:
                'https://c.tenor.com/XI1HnVuLSOEAAAPo/still-here-are-you-still-here.mp4',
              width: 640,
            },
            preview: {
              file: 'media/tenor:6669065364376864993',
              height: 112,
              mime_type: 'video/mp4',
              source_url:
                'https://c.tenor.com/XI1HnVuLSOEAAAP2/still-here-are-you-still-here.mp4',
              width: 150,
            },
          },
          webm: {
            full: {
              file: 'media/tenor:6669065364376864993',
              height: 478,
              mime_type: 'image/webm',
              source_url:
                'https://media.tenor.com/videos/e2f95cb962325e9cf058bec8ec565476/webm',
              width: 640,
            },
            preview: {
              file: 'media/tenor:6669065364376864993',
              height: 112,
              mime_type: 'image/webm',
              source_url:
                'https://media.tenor.com/videos/1511f3558f31d1ea13231b2be3b44b6c/webm',
              width: 150,
            },
          },
        },
        src:
          'https://c.tenor.com/XI1HnVuLSOEAAAPo/still-here-are-you-still-here.mp4',
      },
      attribution: {
        author: {
          displayName: undefined,
          url: undefined,
        },
        registerUsageUrl:
          'https://media3p.googleapis.com/v1/media:registerUsage?token=AX7RMSfLAN8%2B70jpJTvTsQaIeuf5MlhFyWIq54rLC3vULzHC8OeNIaaEreXEvbUkaevy61VVi4LYPLLjhmgIjHZfkHCv3Q%3D%3D',
      },
    };
    expect(getResourceFromMedia3p(media3pResource)).toStrictEqual(
      expectedStoryEditorResource
    );
  });
});
