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
import type { Page, Element, VideoElement } from '@googleforcreators/types';
import { ElementType } from '@googleforcreators/types';

type AMPExtensionName = `amp-${Lowercase<string>}`;

type AMPExtension = {
  src: string;
  name?: AMPExtensionName;
};

function isVideo(element: Element): element is VideoElement {
  return 'tracks' in element;
}

function hasTracks(element: Element) {
  return isVideo(element) && element.tracks && element.tracks.length > 0;
}

/**
 * Goes through all pages in a story to find the needed AMP extensions for them.
 *
 * Always includes the runtime as well as the amp-story extension.
 */
const getUsedAmpExtensions = (pages: Page[]): AMPExtension[] => {
  const extensions: AMPExtension[] = [
    // runtime.
    { src: 'https://cdn.ampproject.org/v0.js' },
    {
      name: 'amp-story',
      src: 'https://cdn.ampproject.org/v0/amp-story-1.0.js',
    },
  ];

  const ampVideo: AMPExtension = {
    name: 'amp-video',
    src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
  };

  const ampStoryCaptions: AMPExtension = {
    name: 'amp-story-captions',
    src: 'https://cdn.ampproject.org/v0/amp-story-captions-0.1.js',
  };

  const ampStoryShopping: AMPExtension = {
    name: 'amp-story-shopping',
    src: 'https://cdn.ampproject.org/v0/amp-story-shopping-0.1.js',
  };

  for (const { elements, backgroundAudio } of pages) {
    if (backgroundAudio?.resource?.src && backgroundAudio?.tracks?.length > 0) {
      extensions.push(ampVideo);
      extensions.push(ampStoryCaptions);
    }
    for (const element of elements) {
      switch (element.type) {
        case ElementType.Video:
          extensions.push(ampVideo);

          if (hasTracks(element)) {
            extensions.push(ampStoryCaptions);
          }
          break;
        case ElementType.Gif:
          extensions.push(ampVideo);
          break;
        case ElementType.Product:
          extensions.push(ampStoryShopping);
          break;
        default:
          break;
      }
    }
  }

  return [...new Set(extensions)];
};

export default getUsedAmpExtensions;
