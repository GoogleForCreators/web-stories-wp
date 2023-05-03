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

function createMockPage() {
  return {
    elements: [
      {
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        opacity: 100,
        flip: {
          vertical: false,
          horizontal: false,
        },
        rotationAngle: 0,
        lockAspectRatio: true,
        mask: {
          type: 'rectangle',
        },
        isBackground: true,
        type: 'shape',
        id: '21e59f86-f8e8-44d4-bf33-6fb25259fdf3',
        isDefaultBackground: true,
      },
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
            r: 201,
            g: 24,
            b: 74,
          },
        },
        type: 'shape',
        x: 112.5,
        y: 281.5,
        width: 55,
        height: 55,
        scale: 100,
        focalX: 50,
        focalY: 50,
        mask: {
          type: 'rectangle',
        },
        id: 'a90d42b7-b1ac-4616-9979-76ed3b70115b',
      },
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
            r: 201,
            g: 24,
            b: 74,
          },
        },
        type: 'shape',
        x: 236,
        y: 281.5,
        width: 55,
        height: 55,
        scale: 100,
        focalX: 50,
        focalY: 50,
        mask: {
          type: 'rectangle',
        },
        id: 'ebfbdd1c-cc6f-4a16-a630-0d8f055e792d',
      },
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
            r: 201,
            g: 24,
            b: 74,
          },
        },
        type: 'shape',
        x: 175,
        y: 281.5,
        width: 55,
        height: 55,
        scale: 100,
        focalX: 50,
        focalY: 50,
        mask: {
          type: 'rectangle',
        },
        id: '686bd91e-0c1a-4344-ae67-f6e9fe2eb6da',
      },
    ],
    animations: [
      {
        id: '80f03ac8-415a-453d-8981-8c91355e866b',
        type: 'effect-fly-in',
        targets: ['ebfbdd1c-cc6f-4a16-a630-0d8f055e792d'],
        flyInDir: 'rightToLeft',
        duration: 600,
        delay: 0,
      },
    ],
    type: 'page',
    id: 'a41fe2ac-88ec-4693-83ec-46a21fda4850',
    backgroundColor: {
      color: {
        r: 233,
        g: 213,
        b: 197,
      },
    },
    pageTemplateType: 'quote',
    defaultBackgroundElement: {
      x: 1,
      y: 1,
      width: 1,
      height: 1,
      opacity: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      lockAspectRatio: true,
      mask: {
        type: 'rectangle',
      },
      isBackground: true,
      type: 'shape',
      id: '61df41e7-b2dc-4ed0-8c5e-91cd08261d1e',
      isDefaultBackground: true,
    },
    image: {
      id: 769,
      height: 1200,
      width: 800,
      url: 'http://localhost:8899/wp-content/uploads/2022/03/web-stories-page-template-768.jpg',
    },
  };
}

export default createMockPage;
