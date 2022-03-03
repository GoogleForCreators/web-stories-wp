/*
 * Copyright 2022 Google LLC
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
import getResourceFromMediaPicker from '../getResourceFromMediaPicker';

describe('getResourceFromMediaPicker', () => {
  it('should transform media picker element into resource', () => {
    const mediaPickerEl = {
      id: 1234,
      title: 'example.jpg',
      filename: 'example.jpg',
      url: 'https://example.com/wp-content/uploads/example.jpg',
      link: 'https://example.com/example-jpg/',
      alt: 'example.jpg',
      author: '1',
      description: 'https://example.com/wp-content/uploads/example.jpg',
      caption: '',
      name: 'example-jpg',
      status: 'inherit',
      uploadedTo: 0,
      date: '2022-02-10T15:03:03.000Z',
      modified: '2022-02-10T15:05:07.000Z',
      menuOrder: 0,
      mime: 'image/jpeg',
      type: 'image',
      subtype: 'jpeg',
      icon: 'https://example.com/wp-includes/images/media/default.png',
      dateFormatted: 'February 10, 2022',
      nonces: {
        update: 'db1fb0b017',
        delete: '52880b1870',
        edit: '5a9af214ea',
      },
      editLink: 'https://example.com/wp-admin/post.php?post=1234&action=edit',
      meta: false,
      authorName: 'Pascal',
      authorLink: 'https://example.com/wp-admin/profile.php',
      filesizeInBytes: 64588,
      filesizeHumanReadable: '63 KB',
      context: 'control-id',
      height: 853,
      width: 640,
      orientation: 'portrait',
      sizes: {
        thumbnail: {
          height: 150,
          width: 150,
          url: 'https://example.com/wp-content/uploads/example-150x150.jpg',
          orientation: 'landscape',
        },
        medium: {
          height: 300,
          width: 225,
          url: 'https://example.com/wp-content/uploads/example-225x300.jpg',
          orientation: 'portrait',
        },
        full: {
          url: 'https://example.com/wp-content/uploads/example.jpg',
          height: 853,
          width: 640,
          orientation: 'portrait',
        },
      },
      compat: {
        item: '',
        meta: '',
      },
      web_stories_base_color: '#bb9470',
      web_stories_blurhash: 'UdJ%aptlo}S#~AX9WD$%NGbHRkn%wIxaS#R+',
      media_details: {
        width: 640,
        height: 853,
        file: '2021/12/example.jpg',
        sizes: {
          medium: {
            file: 'example-225x300.jpg',
            width: 225,
            height: 300,
            mime_type: 'image/jpeg',
            source_url:
              'https://example.com/wp-content/uploads/example-225x300.jpg',
          },
          thumbnail: {
            file: 'example-150x150.jpg',
            width: 150,
            height: 150,
            mime_type: 'image/jpeg',
            source_url:
              'https://example.com/wp-content/uploads/example-150x150.jpg',
          },
          'web-stories-poster-portrait': {
            file: 'example-640x853.jpg',
            width: 640,
            height: 853,
            mime_type: 'image/jpeg',
            source_url:
              'https://example.com/wp-content/uploads/example-640x853.jpg',
          },
          'web-stories-publisher-logo': {
            file: 'example-96x96.jpg',
            width: 96,
            height: 96,
            mime_type: 'image/jpeg',
            source_url:
              'https://example.com/wp-content/uploads/example-96x96.jpg',
          },
          'web-stories-thumbnail': {
            file: 'example-150x200.jpg',
            width: 150,
            height: 200,
            mime_type: 'image/jpeg',
            source_url:
              'https://example.com/wp-content/uploads/example-150x200.jpg',
          },
          full: {
            file: 'example.jpg',
            width: 640,
            height: 853,
            mime_type: 'image/jpeg',
            source_url: 'https://example.com/wp-content/uploads/example.jpg',
          },
        },
      },
      web_stories_media_source: 'editor',
    };

    expect(getResourceFromMediaPicker(mediaPickerEl)).toStrictEqual(
      expect.objectContaining({
        alt: 'example.jpg',
        baseColor: '#bb9470',
        blurHash: 'UdJ%aptlo}S#~AX9WD$%NGbHRkn%wIxaS#R+',
        creationDate: '2022-02-10T15:03:03.000Z',
        height: 853,
        id: 1234,
        isExternal: false,
        isMuted: false,
        isOptimized: false,
        isPlaceholder: false,
        mimeType: 'image/jpeg',
        needsProxy: false,
        src: 'https://example.com/wp-content/uploads/example.jpg',
        type: 'image',
        width: 640,
        sizes: {
          medium: {
            file: 'example-225x300.jpg',
            width: 225,
            height: 300,
            mimeType: 'image/jpeg',
            sourceUrl:
              'https://example.com/wp-content/uploads/example-225x300.jpg',
          },
          thumbnail: {
            file: 'example-150x150.jpg',
            width: 150,
            height: 150,
            mimeType: 'image/jpeg',
            sourceUrl:
              'https://example.com/wp-content/uploads/example-150x150.jpg',
          },
          'web-stories-poster-portrait': {
            file: 'example-640x853.jpg',
            width: 640,
            height: 853,
            mimeType: 'image/jpeg',
            sourceUrl:
              'https://example.com/wp-content/uploads/example-640x853.jpg',
          },
          'web-stories-publisher-logo': {
            file: 'example-96x96.jpg',
            width: 96,
            height: 96,
            mimeType: 'image/jpeg',
            sourceUrl:
              'https://example.com/wp-content/uploads/example-96x96.jpg',
          },
          'web-stories-thumbnail': {
            file: 'example-150x200.jpg',
            width: 150,
            height: 200,
            mimeType: 'image/jpeg',
            sourceUrl:
              'https://example.com/wp-content/uploads/example-150x200.jpg',
          },
          full: {
            file: 'example.jpg',
            width: 640,
            height: 853,
            mimeType: 'image/jpeg',
            sourceUrl: 'https://example.com/wp-content/uploads/example.jpg',
          },
        },
      })
    );
  });

  it('should return resource for VTT file', () => {
    const mediaPickerEl = {
      id: 1234,
      title: 'captions',
      filename: 'captions.vtt',
      url: 'https://example.com/wp-content/uploads/captions.vtt',
      link: 'https://example.com/captions/',
      alt: 'captions',
      author: '1',
      description: '',
      caption: '',
      name: 'captions',
      status: 'inherit',
      uploadedTo: 0,
      date: '2021-11-12T11:15:56.000Z',
      modified: '2021-11-12T11:15:56.000Z',
      menuOrder: 0,
      mime: 'text/vtt',
      type: 'text',
      subtype: 'vtt',
      icon: 'https://example.com/wp-includes/images/media/text.png',
      dateFormatted: 'November 12, 2021',
      nonces: {
        update: 'a43563250f',
        delete: '813aa798e6',
        edit: '2a2853a1b9',
      },
      editLink: 'https://example.com/wp-admin/post.php?post=1234&action=edit',
      meta: false,
      authorName: 'Pascal',
      authorLink: 'https://example.com/wp-admin/profile.php',
      filesizeInBytes: 17551,
      filesizeHumanReadable: '17 KB',
      context: '',
      compat: {
        item: '',
        meta: '',
      },
      web_stories_base_color: '',
      web_stories_blurhash: '',
      media_details: [],
      web_stories_media_source: 'editor',
    };

    expect(getResourceFromMediaPicker(mediaPickerEl)).toStrictEqual(
      expect.objectContaining({
        alt: 'captions',
        baseColor: '',
        blurHash: '',
        creationDate: '2021-11-12T11:15:56.000Z',
        id: 1234,
        isExternal: false,
        isMuted: false,
        isOptimized: false,
        isPlaceholder: false,
        mimeType: 'text/vtt',
        needsProxy: false,
        length: 0,
        src: 'https://example.com/wp-content/uploads/captions.vtt',
        type: 'text',
        sizes: {},
      })
    );
  });
});
