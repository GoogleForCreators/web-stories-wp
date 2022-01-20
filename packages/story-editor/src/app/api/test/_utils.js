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

const TEST_COLOR = {
  color: { r: 1, g: 1, b: 1 },
};

export function createStory(properties = {}) {
  return {
    title: { raw: 'title' },
    excerpt: { raw: 'excerpt' },
    permalinkTemplate: 'http://localhost:8899/web-stories/%pagename%',
    stylePresets: { colors: [TEST_COLOR] },
    author: { id: 1, name: 'John Doe' },
    featuredMedia: { height: 0, id: 0, url: '', width: 0 },
    publisherLogo: { height: 0, id: 0, url: '', width: 0 },
    lockUser: {
      id: 0,
      name: '',
      avatar: '',
    },
    ...properties,
  };
}

export const GET_MEDIA_RESPONSE_HEADER = {
  totalItems: 1,
  totalPages: 1,
};
export const GET_MEDIA_RESPONSE_BODY = [
  {
    id: 274,
    type: 'image',
    mimeType: 'image/jpeg',
    baseColor: '#ffffff',
    output: undefined,
    creationDate: '2020-09-01T05:33:54',
    src: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
    width: 1080,
    height: 2220,
    poster: undefined,
    posterId: undefined,
    length: undefined,
    lengthFormatted: undefined,
    alt: 'IMAGE',
    isPlaceholder: false,
    isMuted: false,
    isOptimized: false,
    isExternal: false,
    sizes: {
      medium: {
        file: 'IMAGE-146x300.jpg',
        width: 146,
        height: 300,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-146x300.jpg',
      },
      large: {
        file: 'IMAGE-498x1024.jpg',
        width: 498,
        height: 1024,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-498x1024.jpg',
      },
      thumbnail: {
        file: 'IMAGE-150x150.jpg',
        width: 150,
        height: 150,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-150x150.jpg',
      },
      medium_large: {
        file: 'IMAGE-768x1579.jpg',
        width: 768,
        height: 1579,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-768x1579.jpg',
      },
      '1536x1536': {
        file: 'IMAGE-747x1536.jpg',
        width: 747,
        height: 1536,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-747x1536.jpg',
      },
      '2048x2048': {
        file: 'IMAGE-996x2048.jpg',
        width: 996,
        height: 2048,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-996x2048.jpg',
      },
      'web-stories-poster-portrait': {
        file: 'IMAGE-640x853.jpg',
        width: 640,
        height: 853,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-640x853.jpg',
      },
      'web-stories-publisher-logo': {
        file: 'IMAGE-96x96.jpg',
        width: 96,
        height: 96,
        mimeType: 'image/jpeg',
        sourceUrl: 'http://wp.local/wp-content/uploads/2020/09/IMAGE-96x96.jpg',
      },
      'web-stories-thumbnail': {
        file: 'IMAGE-150x308.jpg',
        width: 150,
        height: 308,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-150x308.jpg',
      },
      full: {
        file: 'IMAGE.jpg',
        width: 1080,
        height: 2220,
        mimeType: 'image/jpeg',
        sourceUrl: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
      },
    },
    attribution: undefined,
  },
];
