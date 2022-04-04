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

const savedPageTemplate = {
  elements: [
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundColor: { color: { r: 255, g: 255, b: 255 } },
      x: 1,
      y: 1,
      width: 1,
      height: 1,
      mask: { type: 'rectangle' },
      isBackground: true,
      isDefaultBackground: true,
      type: 'shape',
      id: '0243c16d-5c13-48b7-b297-7608eba36119',
    },
    {
      opacity: 100,
      flip: { vertical: false, horizontal: false },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundTextMode: 'NONE',
      font: {
        family: 'Roboto',
        weights: [100, 300, 400, 500, 700, 900],
        styles: ['italic', 'regular'],
        variants: [
          [0, 100],
          [1, 100],
          [0, 300],
          [1, 300],
          [0, 400],
          [1, 400],
          [0, 500],
          [1, 500],
          [0, 700],
          [1, 700],
          [0, 900],
          [1, 900],
        ],
        fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
        service: 'fonts.google.com',
        metrics: {
          upm: 2048,
          asc: 1900,
          des: -500,
          tAsc: 1536,
          tDes: -512,
          tLGap: 102,
          wAsc: 1946,
          wDes: 512,
          xH: 1082,
          capH: 1456,
          yMin: -555,
          yMax: 2163,
          hAsc: 1900,
          hDes: -500,
          lGap: 0,
        },
      },
      fontSize: 16.2,
      backgroundColor: { color: { r: 196, g: 196, b: 196 } },
      lineHeight: 1.5,
      textAlign: 'center',
      padding: { vertical: 0, horizontal: 0, locked: true },
      type: 'text',
      content: 'Fill in some text.',
      borderRadius: {
        locked: true,
        topLeft: 2,
        topRight: 2,
        bottomRight: 2,
        bottomLeft: 2,
      },
      x: 40,
      y: 299,
      width: 165,
      height: 19,
      scale: 100,
      focalX: 50,
      focalY: 50,
      id: '139acf63-c442-4d07-9360-059df047b5e9',
    },
  ],
  backgroundColor: { color: { r: 255, g: 255, b: 255 } },
  type: 'page',
  id: 'c8265226-4c4c-4827-b860-61506be619b6',
};

export default savedPageTemplate;
