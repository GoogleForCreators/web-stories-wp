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
import {
  ElementType,
  type Page,
  type VideoElement,
} from '@googleforcreators/elements';

type ExtensionName = `amp-${Lowercase<string>}`;

interface AmpExtension {
  src: string;
  name?: ExtensionName;
}

/**
 * Goes through all pages in a story to find the needed AMP extensions for them.
 *
 * Always includes the runtime as well as the amp-story extension.
 *
 * @param pages List of pages.
 * @return List of used AMP extensions.
 */
const getUsedAmpExtensions = (pages: Page[]) => {
  const extensions: AmpExtension[] = [
    // runtime.
    { src: 'https://cdn.ampproject.org/v0.js' },
    {
      name: 'amp-story',
      src: 'https://cdn.ampproject.org/v0/amp-story-1.0.js',
    },
  ];

  const ampVideo: AmpExtension = {
    name: 'amp-video',
    src: 'https://cdn.ampproject.org/v0/amp-video-0.1.js',
  };

  const ampStoryCaptions: AmpExtension = {
    name: 'amp-story-captions',
    src: 'https://cdn.ampproject.org/v0/amp-story-captions-0.1.js',
  };

  const ampStoryShopping: AmpExtension = {
    name: 'amp-story-shopping',
    src: 'https://cdn.ampproject.org/v0/amp-story-shopping-0.1.js',
  };

  const ampStoryAudioSticker = {
    name: 'amp-story-audio-sticker',
    src: 'https://cdn.ampproject.org/v0/amp-story-audio-sticker-0.1.js',
  };

  for (const { elements, backgroundAudio } of pages) {
    if (backgroundAudio?.resource?.src && backgroundAudio?.tracks?.length) {
      extensions.push(ampVideo);
      extensions.push(ampStoryCaptions);
    }
    for (const element of elements) {
      const { type } = element;
      switch (type) {
        case ElementType.Video:
          extensions.push(ampVideo);
          if ((element as VideoElement).tracks?.length > 0) {
            extensions.push(ampStoryCaptions);
          }
          break;
        case ElementType.Gif:
          extensions.push(ampVideo);
          break;
        case ElementType.Product:
          extensions.push(ampStoryShopping);
          break;
        case 'audioSticker':
          extensions.push(ampStoryAudioSticker);
          break;
        default:
          break;
      }
    }
  }

  return [...new Set(extensions)];
};

export default getUsedAmpExtensions;
