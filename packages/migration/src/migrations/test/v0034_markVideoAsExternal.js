/*
 * Copyright 2021 Google LLC
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
import markVideoAsExternal from '../v0034_markVideoAsExternal';

describe('markVideoAsExternal', () => {
  it('should migrate 3P video to external', () => {
    expect(
      markVideoAsExternal({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                type: 'square',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
              },
              {
                _test: 'element2',
                type: 'image',
                resource: {
                  type: 'image',
                  mimeType: 'image/png',
                  src: 'https://example.com/image.png',
                  width: 265,
                  height: 527,
                  isExternal: true,
                },
                x: 29,
                y: 55,
                width: 265,
                height: 527,
                fontSize: 58,
              },
            ],
          },
          {
            _test: 'page2',
            elements: [
              {
                opacity: 100,
                flip: {
                  vertical: false,
                  horizontal: false,
                },
                rotationAngle: 0,
                lockAspectRatio: true,
                backgroundColor: {
                  color: {
                    r: 196,
                    g: 196,
                    b: 196,
                  },
                },
                x: 1,
                y: 1,
                width: 1,
                height: 1,
                mask: {
                  type: 'rectangle',
                },
                isBackground: true,
                isDefaultBackground: true,
                type: 'shape',
                id: '2b0da9d0-8a79-4cba-8ab2-572f1ea6f011',
              },
              {
                opacity: 100,
                flip: {
                  vertical: false,
                  horizontal: false,
                },
                rotationAngle: 0,
                lockAspectRatio: true,
                scale: 100,
                focalX: 50,
                focalY: 50,
                resource: {
                  baseColor: [118, 72, 36],
                  type: 'video',
                  mimeType: 'video/mp4',
                  creationDate: '2021-09-09T15:54:00',
                  src: 'http://localhost:8899/wp-content/uploads/2021/09/small-video-muted-2.mp4',
                  width: 560,
                  height: 320,
                  poster:
                    'http://localhost:8899/wp-content/uploads/2021/09/small-video-poster-4.jpeg',
                  posterId: 4702,
                  id: 4701,
                  length: 6,
                  lengthFormatted: '0:06',
                  alt: 'small-video',
                  sizes: {},
                  local: false,
                  isPlaceholder: false,
                  isOptimized: true,
                  isMuted: true,
                },
                controls: false,
                loop: false,
                autoPlay: true,
                tracks: [],
                type: 'video',
                x: 48,
                y: 0,
                width: 280,
                height: 160,
                mask: {
                  type: 'rectangle',
                  showInLibrary: true,
                  name: 'Rectangle',
                  path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                  ratio: 1,
                  supportsBorder: true,
                },
                id: 'c0fcdb12-1c21-4e0b-ae21-3b8d5bc20e26',
              },
              {
                opacity: 100,
                flip: {
                  vertical: false,
                  horizontal: false,
                },
                rotationAngle: 0,
                lockAspectRatio: true,
                scale: 100,
                focalX: 50,
                focalY: 50,
                resource: {
                  baseColor: [204, 177, 140],
                  type: 'image',
                  mimeType: 'image/jpeg',
                  creationDate: '2021-08-05T19:21:03Z',
                  src: 'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=8256&h=5504&fit=max',
                  width: 8256,
                  height: 5504,
                  id: 'media/unsplash:m_wA8tFR128',
                  alt: 'media/unsplash:m_wA8tFR128',
                  sizes: {
                    full: {
                      file: 'media/unsplash:m_wA8tFR128',
                      source_url:
                        'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=8256&h=5504&fit=max',
                      mime_type: 'image/jpeg',
                      width: 8256,
                      height: 5504,
                    },
                    large: {
                      file: 'media/unsplash:m_wA8tFR128',
                      source_url:
                        'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=6604&h=4403&fit=max',
                      mime_type: 'image/jpeg',
                      width: 6604,
                      height: 4403,
                    },
                    '4953_3302': {
                      file: 'media/unsplash:m_wA8tFR128',
                      source_url:
                        'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=4953&h=3302&fit=max',
                      mime_type: 'image/jpeg',
                      width: 4953,
                      height: 3302,
                    },
                    '3302_2201': {
                      file: 'media/unsplash:m_wA8tFR128',
                      source_url:
                        'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=3302&h=2201&fit=max',
                      mime_type: 'image/jpeg',
                      width: 3302,
                      height: 2201,
                    },
                    '1651_1101': {
                      file: 'media/unsplash:m_wA8tFR128',
                      source_url:
                        'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=1651&h=1101&fit=max',
                      mime_type: 'image/jpeg',
                      width: 1651,
                      height: 1101,
                    },
                    web_stories_thumbnail: {
                      file: 'media/unsplash:m_wA8tFR128',
                      source_url:
                        'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=340&h=227&fit=max',
                      mime_type: 'image/jpeg',
                      width: 340,
                      height: 227,
                    },
                  },
                  attribution: {
                    author: {
                      displayName: 'Hillshire Farm',
                      url: 'https://unsplash.com/@hillshirefarm?utm_source=web_stories_wordpress&utm_medium=referral',
                    },
                    registerUsageUrl:
                      'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE86lG6LiDVvZYIEXmajZcQampNUuhLYiVO7gOdLIWi0rS%2BBe2gThAEF7QaCtIfENe3HW8yRrf3LucXQw7NdUKx9Bxbj84xgVgJDaGmroSMxeWRIl9RP/P/PXuV4LVYeuQo4lchY6YL9kUoYcOQYjJEFBPDoLmABiHF6KzPR6mMHH%2BIxQCoC%2Bsgf8QTIZJjlEIOwGvoOIzg65ELpYa4J',
                  },
                  local: false,
                  isPlaceholder: false,
                  isOptimized: false,
                  isExternal: true,
                  isMuted: false,
                },
                type: 'image',
                x: 48,
                y: 0,
                width: 330,
                height: 220,
                mask: {
                  type: 'rectangle',
                  showInLibrary: true,
                  name: 'Rectangle',
                  path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                  ratio: 1,
                  supportsBorder: true,
                },
                id: '25e5b3aa-9483-4ee5-aa61-56512f31e01d',
              },
              {
                opacity: 100,
                flip: {
                  vertical: false,
                  horizontal: false,
                },
                rotationAngle: 0,
                lockAspectRatio: true,
                scale: 100,
                focalX: 50,
                focalY: 50,
                resource: {
                  baseColor: null,
                  type: 'video',
                  mimeType: 'video/mp4',
                  creationDate: '2018-07-09T22:49:13Z',
                  src: 'https://storage.coverr.co/videos/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjMxNTUyODc4fQ.o-jt3gxwUqyHRlrLYNQEP9bMdw2oUyBDsqIfPqHU6SE',
                  width: 1920,
                  height: 1080,
                  poster:
                    'https://storage.coverr.co/p/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk',
                  posterId: 'media/coverr:hWGAKF358u',
                  id: 'media/coverr:hWGAKF358u',
                  length: 13,
                  lengthFormatted: '0:13',
                  alt: 'media/coverr:hWGAKF358u',
                  sizes: {
                    full: {
                      file: 'media/coverr:hWGAKF358u',
                      source_url:
                        'https://storage.coverr.co/videos/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjMxNTUyODc4fQ.o-jt3gxwUqyHRlrLYNQEP9bMdw2oUyBDsqIfPqHU6SE',
                      mime_type: 'video/mp4',
                      width: 1920,
                      height: 1080,
                    },
                    preview: {
                      file: 'media/coverr:hWGAKF358u',
                      source_url:
                        'https://storage.coverr.co/videos/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjMxNTUyODc4fQ.o-jt3gxwUqyHRlrLYNQEP9bMdw2oUyBDsqIfPqHU6SE',
                      mime_type: 'video/mp4',
                      width: 640,
                      height: 360,
                    },
                  },
                  local: false,
                  isPlaceholder: false,
                  isOptimized: true,
                  isMuted: true,
                },
                controls: false,
                loop: false,
                autoPlay: true,
                tracks: [],
                type: 'video',
                x: 48,
                y: 0,
                width: 330,
                height: 185,
                mask: {
                  type: 'rectangle',
                  showInLibrary: true,
                  name: 'Rectangle',
                  path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                  ratio: 1,
                  supportsBorder: true,
                },
                id: '6684f5ad-836c-4b2f-99af-e7029ae9a23a',
              },
              {
                opacity: 100,
                flip: {
                  vertical: false,
                  horizontal: false,
                },
                rotationAngle: 0,
                lockAspectRatio: true,
                scale: 100,
                focalX: 50,
                focalY: 50,
                resource: {
                  baseColor: null,
                  type: 'gif',
                  mimeType: 'image/gif',
                  creationDate: '2021-01-24T19:47:19Z',
                  src: 'https://c.tenor.com/pKnBHa2ndvAAAAAC/blackpink-jisoo.gif',
                  width: 498,
                  height: 424,
                  poster:
                    'https://c.tenor.com/pKnBHa2ndvAAAAAe/blackpink-jisoo.png',
                  posterId: 'media/tenor:11865227026495928048',
                  id: 'media/tenor:11865227026495928048',
                  alt: 'media/tenor:11865227026495928048',
                  sizes: {
                    full: {
                      file: 'media/tenor:11865227026495928048',
                      source_url:
                        'https://c.tenor.com/pKnBHa2ndvAAAAAC/blackpink-jisoo.gif',
                      mime_type: 'image/gif',
                      width: 498,
                      height: 424,
                    },
                    large: {
                      file: 'media/tenor:11865227026495928048',
                      source_url:
                        'https://c.tenor.com/pKnBHa2ndvAAAAAM/blackpink-jisoo.gif',
                      mime_type: 'image/gif',
                      width: 220,
                      height: 188,
                    },
                    web_stories_thumbnail: {
                      file: 'media/tenor:11865227026495928048',
                      source_url:
                        'https://c.tenor.com/pKnBHa2ndvAAAAAS/blackpink-jisoo.gif',
                      mime_type: 'image/gif',
                      width: 105,
                      height: 90,
                    },
                  },
                  attribution: {
                    author: {},
                    registerUsageUrl:
                      'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE8I8BnSU6u4O5s/C6Ga8oW0K5NV4xcgWjKL07xCVPgk9HWpdiEqj1yxvu5yHljtmnjnFro2XYFva9HVZT%2BJMYLscTw%3D',
                  },
                  output: {
                    mimeType: 'video/mp4',
                    src: 'https://c.tenor.com/pKnBHa2ndvAAAAPo/blackpink-jisoo.mp4',
                  },
                  local: false,
                  isPlaceholder: false,
                  isOptimized: true,
                  isMuted: false,
                },
                type: 'gif',
                x: 48,
                y: 0,
                width: 249,
                height: 212,
                mask: {
                  type: 'rectangle',
                  showInLibrary: true,
                  name: 'Rectangle',
                  path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                  ratio: 1,
                  supportsBorder: true,
                },
                id: '953777f0-e959-457c-aef2-c06780cf3478',
              },
              {
                opacity: 100,
                flip: {
                  vertical: false,
                  horizontal: false,
                },
                rotationAngle: 0,
                lockAspectRatio: true,
                scale: 100,
                focalX: 50,
                focalY: 50,
                resource: {
                  type: 'image',
                  mimeType: 'image/gif',
                  src: 'https://media4.giphy.com/media/zOvBKUUEERdNm/giphy.gif?cid=ecf05e478ffb4156f631b7c278fad987f328fe33f2fdd3d1&rid=giphy.gif&ct=g',
                  width: 320,
                  height: 180,
                  alt: 'giphy.gif?cid=ecf05e478ffb4156f631b7c278fad987f328fe33f2fdd3d1&rid=giphy',
                  sizes: {},
                  local: false,
                  isPlaceholder: false,
                  isOptimized: false,
                  isMuted: false,
                },
                type: 'image',
                x: 48,
                y: 0,
                width: 160,
                height: 90,
                mask: {
                  type: 'rectangle',
                  showInLibrary: true,
                  name: 'Rectangle',
                  path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                  ratio: 1,
                  supportsBorder: true,
                },
                id: '1581fcfc-2c39-4fc2-bb3b-2685edf5e3fa',
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [
            {
              _test: 'element1',
              type: 'square',
              x: 10,
              y: 20,
              width: 100,
              height: 200,
            },
            {
              _test: 'element2',
              type: 'image',
              resource: {
                type: 'image',
                mimeType: 'image/png',
                src: 'https://example.com/image.png',
                width: 265,
                height: 527,
                isExternal: true,
              },
              x: 29,
              y: 55,
              width: 265,
              height: 527,
              fontSize: 58,
            },
          ],
        },
        {
          _test: 'page2',
          elements: [
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              backgroundColor: {
                color: {
                  r: 196,
                  g: 196,
                  b: 196,
                },
              },
              x: 1,
              y: 1,
              width: 1,
              height: 1,
              mask: {
                type: 'rectangle',
              },
              isBackground: true,
              isDefaultBackground: true,
              type: 'shape',
              id: '2b0da9d0-8a79-4cba-8ab2-572f1ea6f011',
            },
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              scale: 100,
              focalX: 50,
              focalY: 50,
              resource: {
                baseColor: [118, 72, 36],
                type: 'video',
                mimeType: 'video/mp4',
                creationDate: '2021-09-09T15:54:00',
                src: 'http://localhost:8899/wp-content/uploads/2021/09/small-video-muted-2.mp4',
                width: 560,
                height: 320,
                poster:
                  'http://localhost:8899/wp-content/uploads/2021/09/small-video-poster-4.jpeg',
                posterId: 4702,
                id: 4701,
                length: 6,
                lengthFormatted: '0:06',
                alt: 'small-video',
                sizes: {},
                local: false,
                isPlaceholder: false,
                isExternal: false,
                isOptimized: true,
                isMuted: true,
              },
              controls: false,
              loop: false,
              autoPlay: true,
              tracks: [],
              type: 'video',
              x: 48,
              y: 0,
              width: 280,
              height: 160,
              mask: {
                type: 'rectangle',
                showInLibrary: true,
                name: 'Rectangle',
                path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                ratio: 1,
                supportsBorder: true,
              },
              id: 'c0fcdb12-1c21-4e0b-ae21-3b8d5bc20e26',
            },
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              scale: 100,
              focalX: 50,
              focalY: 50,
              resource: {
                baseColor: [204, 177, 140],
                type: 'image',
                mimeType: 'image/jpeg',
                creationDate: '2021-08-05T19:21:03Z',
                src: 'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=8256&h=5504&fit=max',
                width: 8256,
                height: 5504,
                id: 'media/unsplash:m_wA8tFR128',
                alt: 'media/unsplash:m_wA8tFR128',
                sizes: {
                  full: {
                    file: 'media/unsplash:m_wA8tFR128',
                    source_url:
                      'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=8256&h=5504&fit=max',
                    mime_type: 'image/jpeg',
                    width: 8256,
                    height: 5504,
                  },
                  large: {
                    file: 'media/unsplash:m_wA8tFR128',
                    source_url:
                      'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=6604&h=4403&fit=max',
                    mime_type: 'image/jpeg',
                    width: 6604,
                    height: 4403,
                  },
                  '4953_3302': {
                    file: 'media/unsplash:m_wA8tFR128',
                    source_url:
                      'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=4953&h=3302&fit=max',
                    mime_type: 'image/jpeg',
                    width: 4953,
                    height: 3302,
                  },
                  '3302_2201': {
                    file: 'media/unsplash:m_wA8tFR128',
                    source_url:
                      'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=3302&h=2201&fit=max',
                    mime_type: 'image/jpeg',
                    width: 3302,
                    height: 2201,
                  },
                  '1651_1101': {
                    file: 'media/unsplash:m_wA8tFR128',
                    source_url:
                      'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=1651&h=1101&fit=max',
                    mime_type: 'image/jpeg',
                    width: 1651,
                    height: 1101,
                  },
                  web_stories_thumbnail: {
                    file: 'media/unsplash:m_wA8tFR128',
                    source_url:
                      'https://images.unsplash.com/photo-1628191139344-11bec156abdc?ixid=MnwxMzcxOTN8MXwxfGFsbHwxfHx8fHx8Mnx8MTYzMTU1MjQ1NA&ixlib=rb-1.2.1&fm=jpg&w=340&h=227&fit=max',
                    mime_type: 'image/jpeg',
                    width: 340,
                    height: 227,
                  },
                },
                attribution: {
                  author: {
                    displayName: 'Hillshire Farm',
                    url: 'https://unsplash.com/@hillshirefarm?utm_source=web_stories_wordpress&utm_medium=referral',
                  },
                  registerUsageUrl:
                    'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE86lG6LiDVvZYIEXmajZcQampNUuhLYiVO7gOdLIWi0rS%2BBe2gThAEF7QaCtIfENe3HW8yRrf3LucXQw7NdUKx9Bxbj84xgVgJDaGmroSMxeWRIl9RP/P/PXuV4LVYeuQo4lchY6YL9kUoYcOQYjJEFBPDoLmABiHF6KzPR6mMHH%2BIxQCoC%2Bsgf8QTIZJjlEIOwGvoOIzg65ELpYa4J',
                },
                local: false,
                isPlaceholder: false,
                isOptimized: false,
                isExternal: true,
                isMuted: false,
              },
              type: 'image',
              x: 48,
              y: 0,
              width: 330,
              height: 220,
              mask: {
                type: 'rectangle',
                showInLibrary: true,
                name: 'Rectangle',
                path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                ratio: 1,
                supportsBorder: true,
              },
              id: '25e5b3aa-9483-4ee5-aa61-56512f31e01d',
            },
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              scale: 100,
              focalX: 50,
              focalY: 50,
              resource: {
                baseColor: null,
                type: 'video',
                mimeType: 'video/mp4',
                creationDate: '2018-07-09T22:49:13Z',
                src: 'https://storage.coverr.co/videos/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjMxNTUyODc4fQ.o-jt3gxwUqyHRlrLYNQEP9bMdw2oUyBDsqIfPqHU6SE',
                width: 1920,
                height: 1080,
                poster:
                  'https://storage.coverr.co/p/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk',
                posterId: 'media/coverr:hWGAKF358u',
                id: 'media/coverr:hWGAKF358u',
                length: 13,
                lengthFormatted: '0:13',
                alt: 'media/coverr:hWGAKF358u',
                sizes: {
                  full: {
                    file: 'media/coverr:hWGAKF358u',
                    source_url:
                      'https://storage.coverr.co/videos/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjMxNTUyODc4fQ.o-jt3gxwUqyHRlrLYNQEP9bMdw2oUyBDsqIfPqHU6SE',
                    mime_type: 'video/mp4',
                    width: 1920,
                    height: 1080,
                  },
                  preview: {
                    file: 'media/coverr:hWGAKF358u',
                    source_url:
                      'https://storage.coverr.co/videos/rhOM3iuhDqxedD7lKLpPO34yN2lhf5Kk/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjMxNTUyODc4fQ.o-jt3gxwUqyHRlrLYNQEP9bMdw2oUyBDsqIfPqHU6SE',
                    mime_type: 'video/mp4',
                    width: 640,
                    height: 360,
                  },
                },
                local: false,
                isPlaceholder: false,
                isOptimized: true,
                isExternal: true,
                isMuted: true,
              },
              controls: false,
              loop: false,
              autoPlay: true,
              tracks: [],
              type: 'video',
              x: 48,
              y: 0,
              width: 330,
              height: 185,
              mask: {
                type: 'rectangle',
                showInLibrary: true,
                name: 'Rectangle',
                path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                ratio: 1,
                supportsBorder: true,
              },
              id: '6684f5ad-836c-4b2f-99af-e7029ae9a23a',
            },
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              scale: 100,
              focalX: 50,
              focalY: 50,
              resource: {
                baseColor: null,
                type: 'gif',
                mimeType: 'image/gif',
                creationDate: '2021-01-24T19:47:19Z',
                src: 'https://c.tenor.com/pKnBHa2ndvAAAAAC/blackpink-jisoo.gif',
                width: 498,
                height: 424,
                poster:
                  'https://c.tenor.com/pKnBHa2ndvAAAAAe/blackpink-jisoo.png',
                posterId: 'media/tenor:11865227026495928048',
                id: 'media/tenor:11865227026495928048',
                alt: 'media/tenor:11865227026495928048',
                sizes: {
                  full: {
                    file: 'media/tenor:11865227026495928048',
                    source_url:
                      'https://c.tenor.com/pKnBHa2ndvAAAAAC/blackpink-jisoo.gif',
                    mime_type: 'image/gif',
                    width: 498,
                    height: 424,
                  },
                  large: {
                    file: 'media/tenor:11865227026495928048',
                    source_url:
                      'https://c.tenor.com/pKnBHa2ndvAAAAAM/blackpink-jisoo.gif',
                    mime_type: 'image/gif',
                    width: 220,
                    height: 188,
                  },
                  web_stories_thumbnail: {
                    file: 'media/tenor:11865227026495928048',
                    source_url:
                      'https://c.tenor.com/pKnBHa2ndvAAAAAS/blackpink-jisoo.gif',
                    mime_type: 'image/gif',
                    width: 105,
                    height: 90,
                  },
                },
                attribution: {
                  author: {},
                  registerUsageUrl:
                    'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE8I8BnSU6u4O5s/C6Ga8oW0K5NV4xcgWjKL07xCVPgk9HWpdiEqj1yxvu5yHljtmnjnFro2XYFva9HVZT%2BJMYLscTw%3D',
                },
                output: {
                  mimeType: 'video/mp4',
                  src: 'https://c.tenor.com/pKnBHa2ndvAAAAPo/blackpink-jisoo.mp4',
                },
                local: false,
                isPlaceholder: false,
                isOptimized: true,
                isMuted: false,
              },
              type: 'gif',
              x: 48,
              y: 0,
              width: 249,
              height: 212,
              mask: {
                type: 'rectangle',
                showInLibrary: true,
                name: 'Rectangle',
                path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                ratio: 1,
                supportsBorder: true,
              },
              id: '953777f0-e959-457c-aef2-c06780cf3478',
            },
            {
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              scale: 100,
              focalX: 50,
              focalY: 50,
              resource: {
                type: 'image',
                mimeType: 'image/gif',
                src: 'https://media4.giphy.com/media/zOvBKUUEERdNm/giphy.gif?cid=ecf05e478ffb4156f631b7c278fad987f328fe33f2fdd3d1&rid=giphy.gif&ct=g',
                width: 320,
                height: 180,
                alt: 'giphy.gif?cid=ecf05e478ffb4156f631b7c278fad987f328fe33f2fdd3d1&rid=giphy',
                sizes: {},
                local: false,
                isExternal: true,
                isPlaceholder: false,
                isOptimized: false,
                isMuted: false,
              },
              type: 'image',
              x: 48,
              y: 0,
              width: 160,
              height: 90,
              mask: {
                type: 'rectangle',
                showInLibrary: true,
                name: 'Rectangle',
                path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                ratio: 1,
                supportsBorder: true,
              },
              id: '1581fcfc-2c39-4fc2-bb3b-2685edf5e3fa',
            },
          ],
        },
      ],
    });
  });
});
