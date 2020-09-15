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
import React from 'react';

/**
 * Internal dependencies
 */
import TextSet from '../textSet';
import LibraryProvider from '../../../../libraryProvider';
import { UnitsProvider } from '../../../../../../units';
import { getBox } from '../../../../../../units/dimensions';
import { TransformProvider } from '../../../../../transform';
import { FontProvider } from '../../../../../../app/font';
import { APIProvider } from '../../../../../../app/api';
import { ConfigProvider } from '../../../../../../app/config';
import { PAGE_RATIO, TEXT_SET_SIZE } from '../../../../../../constants';

export default {
  title: 'Stories Editor/Components/Library/Panes/Text/TextSet',
  component: TextSet,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};

export const _default = () => {
  const textSet1 = [
    {
      opacity: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundTextMode: 'NONE',
      font: {
        family: 'Alegreya',
        service: 'fonts.google.com',
        fallbacks: ['serif'],
        weights: [400, 500, 700, 800, 900],
        styles: ['regular', 'italic'],
        variants: [
          [0, 400],
          [1, 400],
          [0, 500],
          [1, 500],
          [0, 700],
          [1, 700],
          [0, 800],
          [1, 800],
          [0, 900],
          [1, 900],
        ],
        metrics: {
          upm: 1000,
          asc: 1016,
          des: -345,
          tAsc: 1016,
          tDes: -345,
          tLGap: 0,
          wAsc: 1123,
          wDes: 345,
          xH: 452,
          capH: 636,
          yMin: -293,
          yMax: 962,
          hAsc: 1016,
          hDes: -345,
          lGap: 0,
        },
      },
      fontSize: 36,
      backgroundColor: {
        color: {
          r: 196,
          g: 196,
          b: 196,
        },
      },
      lineHeight: 1.1,
      textAlign: 'center',
      padding: {
        locked: true,
        horizontal: 0,
        vertical: 0,
      },
      type: 'text',
      content: '<span style="font-weight: 400">Good design is aesthetic</span>',
      fontWeight: 700,
      x: 0,
      y: 15,
      width: 328,
      height: 78,
      scale: 100,
      focalX: 50,
      focalY: 50,
      id: '3631d6b0-0f6a-4959-9df0-b9f3d7fcab35',
      textSetWidth: 333,
      textSetHeight: 304,
    },
    {
      opacity: 100,
      flip: {
        vertical: false,
        horizontal: false,
      },
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
      fontSize: 18,
      backgroundColor: {
        color: {
          r: 196,
          g: 196,
          b: 196,
        },
      },
      lineHeight: 1.5,
      textAlign: 'justify',
      padding: {
        locked: true,
        horizontal: 0,
        vertical: 0,
      },
      type: 'text',
      content:
        'The possibilities for innovation are not, by any means, exhausted. Technological development is always offering new opportunities for innovative design. But innovative design always develops in tandem with innovative technology, and can never be an end in itself.',
      fontWeight: 400,
      x: 0,
      y: 110,
      width: 333,
      height: 181,
      scale: 100,
      focalX: 50,
      focalY: 50,
      id: 'c61010e2-750e-4e6d-8372-bfb5e93f2312',
      textSetWidth: 333,
      textSetHeight: 304,
    },
  ];

  return (
    <LibraryProvider insertElements={() => {}}>
      <UnitsProvider
        getBox={getBox}
        pageSize={{
          width: TEXT_SET_SIZE,
          height: TEXT_SET_SIZE / PAGE_RATIO,
        }}
      >
        <TransformProvider registerTransformHandler={() => {}}>
          <ConfigProvider config={{ api: { stories: [] } }}>
            <APIProvider getAllFonts={() => {}}>
              <FontProvider maybeEnqueueFontStyle={() => {}}>
                <TextSet elements={textSet1} index={0} />
              </FontProvider>
            </APIProvider>
          </ConfigProvider>
        </TransformProvider>
      </UnitsProvider>
    </LibraryProvider>
  );
};
