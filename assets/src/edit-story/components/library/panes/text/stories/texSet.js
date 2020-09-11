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
import TextSet from '../textSets/textSet';
import LibraryProvider from '../../../libraryProvider';
import { UnitsProvider } from '../../../../../units';
import { getBox } from '../../../../../units/dimensions';
import { TransformProvider } from '../../../../transform';
import { FontProvider } from '../../../../../app/font';
import { APIProvider } from '../../../../../app/api';
import { ConfigProvider } from '../../../../../app/config';
import { TEXT_SET_SIZE } from '../../../../../constants';

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
      lockAspectRatio: false,
      backgroundTextMode: 'HIGHLIGHT',
      font: {
        family: 'Princess Sofia',
        service: 'fonts.google.com',
        fallbacks: ['cursive'],
        weights: [400],
        styles: ['regular'],
        variants: [[0, 400]],
      },
      fontSize: 50,
      backgroundColor: {
        color: {
          r: 15,
          g: 15,
          b: 15,
        },
      },
      lineHeight: 3,
      textAlign: 'center',
      padding: {
        locked: true,
        horizontal: 0,
        vertical: 0,
      },
      type: 'text',
      content: '<span style="color: #ddd0d0">Subscribe now!</span>',
      fontWeight: 400,
      x: 30,
      y: 233,
      width: 358,
      height: 150,
      scale: 100,
      focalX: 50,
      focalY: 50,
      id: 'b027dcd3-f9da-44e9-9b44-bd2da3e51851',
    },
    {
      opacity: 30,
      flip: {
        vertical: false,
        horizontal: false,
      },
      rotationAngle: 0,
      lockAspectRatio: true,
      backgroundTextMode: 'FILL',
      font: {
        family: 'BioRhyme',
        service: 'fonts.google.com',
        fallbacks: ['serif'],
        weights: [200, 300, 400, 700, 800],
        styles: ['regular'],
        variants: [
          [0, 200],
          [0, 300],
          [0, 400],
          [0, 700],
          [0, 800],
        ],
      },
      fontSize: 26,
      backgroundColor: {
        color: {
          r: 255,
          g: 255,
          b: 255,
        },
      },
      lineHeight: 1.5,
      textAlign: 'center',
      padding: {
        locked: true,
        horizontal: 0,
        vertical: 0,
      },
      type: 'text',
      content: '<span style="font-weight: 700">Contact us!</span>',
      fontWeight: 400,
      x: 82,
      y: 404,
      width: 252,
      height: 39,
      scale: 100,
      focalX: 50,
      focalY: 50,
      id: '72d6429a-1e1a-4b42-9cb2-e8d2e1afc03e',
    },
  ];

  const textSet2 = [
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
      textAlign: 'left',
      padding: {
        locked: true,
        horizontal: 0,
        vertical: 0,
      },
      type: 'text',
      content:
        'The possibilities for innovation are not, by any means, exhausted. Technological development is always offering new opportunities for innovative design. But innovative design always develops in tandem with innovative technology, and can never be an end in itself.',
      x: 43,
      y: 225,
      width: 334,
      height: 183,
      scale: 100,
      focalX: 50,
      focalY: 50,
      id: 'f7167da6-fd69-4abb-b688-60c17f0e2e37',
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
      },
      fontSize: 36,
      backgroundColor: {
        color: {
          r: 196,
          g: 196,
          b: 196,
        },
      },
      lineHeight: 1.2,
      textAlign: 'initial',
      padding: {
        locked: true,
        horizontal: 0,
        vertical: 0,
      },
      type: 'text',
      content:
        '<span style="font-weight: 700">Good design is innovative</span>',
      x: 43,
      y: 119,
      width: 246,
      height: 86,
      scale: 100,
      focalX: 50,
      focalY: 50,
      id: 'ae467c59-7fac-43c1-b2ad-2b68938879c9',
    },
  ];

  return (
    <LibraryProvider insertElements={() => {}}>
      <UnitsProvider
        getBox={getBox}
        pageSize={{
          width: TEXT_SET_SIZE,
          height: TEXT_SET_SIZE,
        }}
      >
        <TransformProvider registerTransformHandler={() => {}}>
          <ConfigProvider config={{ api: { stories: [] } }}>
            <APIProvider getAllFonts={() => {}}>
              <FontProvider maybeEnqueueFontStyle={() => {}}>
                <TextSet elements={textSet1} index={0} />
                <TextSet elements={textSet2} index={1} />
              </FontProvider>
            </APIProvider>
          </ConfigProvider>
        </TransformProvider>
      </UnitsProvider>
    </LibraryProvider>
  );
};
