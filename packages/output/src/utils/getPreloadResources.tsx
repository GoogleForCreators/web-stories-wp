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
import type { Page, GifResource } from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import type { PreloadResource } from '../types';

/**
 * Goes through all pages in a story to find the resources that should be preloaded.
 */
function getPreloadResources(pages: Page[]): PreloadResource[] {
  const preloadResources: PreloadResource[] = [];

  if (pages.length === 0) {
    return preloadResources;
  }

  for (const { type, resource, isBackground } of pages[0].elements) {
    if (!['image', 'video', 'gif'].includes(type)) {
      continue;
    }

    if (!isBackground) {
      continue;
    }
    const gifResource = resource as GifResource;
    // resource?.output?.src is used only for GIF resources.
    const src =
      gifResource?.output?.src || ((resource && resource.src) as string);

    preloadResources.push({
      url: src,
      type: 'image' === type ? 'image' : 'video',
    });
  }

  return preloadResources;
}

export default getPreloadResources;
