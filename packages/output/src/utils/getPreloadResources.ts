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
import { elementIs, ElementType, type Page } from '@googleforcreators/elements';

interface PreloadResource {
  url: string;
  type: string;
}

/**
 * Goes through all pages in a story to find the resources that should be preloaded.
 *
 * Currently, this includes the first page's background image/video.
 *
 * @param pages List of pages.
 * @return List of preload resources.
 */
function getPreloadResources(pages: Page[]) {
  const preloadResources: PreloadResource[] = [];

  if (pages.length === 0) {
    return preloadResources;
  }

  const mediaElements = pages[0].elements
    .filter(elementIs.media)
    .filter(elementIs.backgroundable);

  for (const element of mediaElements) {
    const { type, isBackground } = element;
    if (!isBackground) {
      continue;
    }

    // resource?.output?.src is used only for GIF resources.
    const src = elementIs.gif(element)
      ? element.resource?.output?.src
      : element.resource.src;

    preloadResources.push({
      url: src,
      type: type === ElementType.Image ? 'image' : 'video',
    });
  }

  return preloadResources;
}

export default getPreloadResources;
