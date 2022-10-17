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
 * External dependencies
 */
import type {
  Page,
  Element,
  MediaElement,
  GifElement,
} from '@googleforcreators/types';

interface PreloadResource {
  url: string;
  type: string;
}

function isMediaElement(element: Element): element is MediaElement {
  return ['image', 'video', 'gif'].includes(element.type);
}

function isGifElement(element: Element): element is GifElement {
  return 'gif' === element.type;
}

/**
 * Goes through all pages in a story to find the resources that should be preloaded.
 */
function getPreloadResources(pages: Page[]): PreloadResource[] {
  const preloadResources: PreloadResource[] = [];

  if (pages.length === 0) {
    return preloadResources;
  }

  for (const element of pages[0].elements) {
    if (!isMediaElement(element)) {
      continue;
    }

    const { resource, isBackground } = element;

    if (!isBackground) {
      continue;
    }

    const url = isGifElement(element)
      ? element.resource.output.src
      : resource.src;

    preloadResources.push({
      url,
      type: 'image' === element.type ? 'image' : 'video',
    });
  }

  return preloadResources;
}

export default getPreloadResources;
