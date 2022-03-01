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
import { UnitsProvider, getBox, PAGE_RATIO } from '@googleforcreators/units';
import { TransformContext } from '@googleforcreators/transform';

/**
 * Internal dependencies
 */
import LibraryContext from '../../../../context';
import FontContext from '../../../../../../app/font/context';
import APIContext from '../../../../../../app/api/context';
import ConfigContext from '../../../../../../app/config/context';
import TextSet from '../textSet';
import { renderWithTheme } from '../../../../../../testUtils';
import { TEXT_SET_SIZE } from '../../../../../../constants';
import StoryContext from '../../../../../../app/story/context';
import { LayoutProvider } from '../../../../../../app/layout';
import CanvasContext from '../../../../../../app/canvas/context';

const SET = [
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
    x: 40,
    y: 291,
    width: 328,
    height: 78,
    scale: 100,
    focalX: 50,
    focalY: 50,
    id: '1',
    previewOffsetX: 0,
    previewOffsetY: 0,
    textSetWidth: 333,
    textSetHeight: 304,
    normalizedOffsetX: 0,
    normalizedOffsetY: 0,
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
    x: 40,
    y: 411,
    width: 333,
    height: 181,
    scale: 100,
    focalX: 50,
    focalY: 50,
    id: '2',
    previewOffsetX: 30,
    previewOffsetY: 30,
    textSetWidth: 333,
    textSetHeight: 304,
    normalizedOffsetX: 0,
    normalizedOffsetY: 0,
  },
];

const insertTextSet = jest.fn();

function setup(elements, id) {
  const libraryValue = {
    actions: {
      insertTextSet,
    },
  };
  const transformValue = {
    actions: {
      registerTransformHandler: () => {},
    },
  };
  const configValue = { api: { stories: [] } };
  const fontsValue = {
    actions: {
      maybeEnqueueFontStyle: () => {},
      getCustomFonts: jest.fn(),
      getCuratedFonts: jest.fn(),
    },
  };
  const apiValue = {
    actions: {
      getAllFonts: () => [],
    },
  };

  const storyValue = {
    actions: {
      setSelectedElementsById: jest.fn(),
    },
    state: {
      currentPage: {},
    },
  };

  const canvasValue = {
    state: {
      nodesById: {},
      pageSize: {},
      pageContainer: document.body,
      canvasContainer: document.body,
      designSpaceGuideline: {},
    },
    actions: {},
  };

  return renderWithTheme(
    <TransformContext.Provider value={transformValue}>
      <ConfigContext.Provider value={configValue}>
        <APIContext.Provider value={apiValue}>
          <StoryContext.Provider value={storyValue}>
            <CanvasContext.Provider value={canvasValue}>
              <FontContext.Provider value={fontsValue}>
                <LayoutProvider>
                  <LibraryContext.Provider value={libraryValue}>
                    <UnitsProvider
                      pageSize={{
                        width: TEXT_SET_SIZE,
                        height: TEXT_SET_SIZE / PAGE_RATIO,
                      }}
                      getBox={getBox}
                    >
                      <TextSet
                        ref={{ current: null }}
                        id={id}
                        elements={elements}
                        index={0}
                      />
                    </UnitsProvider>
                  </LibraryContext.Provider>
                </LayoutProvider>
              </FontContext.Provider>
            </CanvasContext.Provider>
          </StoryContext.Provider>
        </APIContext.Provider>
      </ConfigContext.Provider>
    </TransformContext.Provider>
  );
}

/* eslint-disable testing-library/no-container */

describe('TextSets', () => {
  beforeEach(() => {
    insertTextSet.mockReset();
  });

  const SET_ID = '123';

  it('should render the correct images for the text sets x', () => {
    const { container } = setup(SET, SET_ID);
    const textSetImg = container.querySelector(`img[src$="${SET_ID}.png"]`);
    expect(textSetImg).toBeTruthy();
  });
});

/* eslint-enable testing-library/no-container */
