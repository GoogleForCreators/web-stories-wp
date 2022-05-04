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
 * External dependencies
 */
import {
  useAPI,
  useConfig,
  StoryContext,
  HistoryProvider,
} from '@googleforcreators/story-editor';
import { renderWithTheme } from '@googleforcreators/test-utils';

jest.mock('@googleforcreators/story-editor', () => ({
  ...jest.requireActual('@googleforcreators/story-editor'),
  useConfig: jest.fn(),
  useAPI: jest.fn(),
}));

const mockUseConfig = useConfig;
const mockUseAPI = useAPI;
const mockAllFonts = [
  {
    family: 'Rock Salt',
    fallbacks: ['cursive'],
    weights: [400, 500], // add weight
    styles: ['regular'],
    variants: [[0, 400]],
    service: 'fonts.google.com',
    metrics: {
      upm: 1028, // modify upm
      asc: 1623,
      des: -788,
      tAsc: 824,
      tDes: -240,
      tLGap: 63,
      wAsc: 1623,
      wDes: 788,
      xH: 833,
      capH: 1154,
      yMin: -787,
      yMax: 1623,
      hAsc: 1623,
      hDes: -788,
      lGap: 32,
    },
  },
];

const storyContext = {
  state: {
    version: 1,
    pages: [
      {
        elements: [
          {
            opacity: 100,
            flip: {
              vertical: false,
              horizontal: false,
            },
            rotationAngle: 0,
            lockAspectRatio: true,
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
            id: '637058d7-6ab3-47e8-addb-eb9ae56bd540',
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
              family: 'Rock Salt',
              fallbacks: ['cursive'],
              weights: [400],
              styles: ['regular'],
              variants: [[0, 400]],
              service: 'fonts.google.com',
              metrics: {
                upm: 1024,
                asc: 1623,
                des: -788,
                tAsc: 824,
                tDes: -240,
                tLGap: 63,
                wAsc: 1623,
                wDes: 788,
                xH: 833,
                capH: 1154,
                yMin: -787,
                yMax: 1623,
                hAsc: 1623,
                hDes: -788,
                lGap: 32,
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
            lineHeight: 1.19,
            textAlign: 'left',
            padding: {
              locked: true,
              hasHiddenPadding: false,
              horizontal: 0,
              vertical: 0,
            },
            type: 'text',
            content: 'My Test Story',
            borderRadius: {
              locked: true,
              topLeft: 2,
              topRight: 2,
              bottomRight: 2,
              bottomLeft: 2,
            },
            x: 40,
            y: 312,
            width: 307,
            height: 85,
            scale: 100,
            focalX: 50,
            focalY: 50,
            id: '8c6f0de5-c622-4a7e-9902-2a2d0f20eb61',
            tagName: 'h1',
          },
        ],
        backgroundColor: {
          color: {
            r: 255,
            g: 255,
            b: 255,
          },
        },
        type: 'page',
        id: '0cbeb527-cb8b-4316-ae5b-c0db7f81159f',
      },
    ],
  },
};

/**
 * Internal dependencies
 */
import { FontCheck } from '..';

jest.mock('../fontCheckDialog', () => {
  return {
    __esModule: true,
    FontCheckDialog: () => {
      return <div>{'Font Check Dialog'}</div>;
    },
  };
});

describe('fontCheck metrics', () => {
  beforeEach(() => {
    mockUseConfig.mockReturnValue({
      dashboardSettingsLink: '/',
    });
    mockUseAPI.mockReturnValue({ actions: { getFonts: () => mockAllFonts } });
  });

  it('should call updateElementsByFontFamily when font metrics update', async () => {
    const mockUpdateByFontFamily = jest.fn();
    const context = {
      ...storyContext,
      actions: { updateElementsByFontFamily: mockUpdateByFontFamily },
    };
    await renderWithTheme(
      <HistoryProvider size={50}>
        <StoryContext.Provider value={context}>
          <FontCheck />
        </StoryContext.Provider>
      </HistoryProvider>
    );
    expect(mockUpdateByFontFamily).toHaveBeenCalledTimes(1);
  });
});
