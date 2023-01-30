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
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import storyPageToNode from './storyPageToNode';

/**
 * @typedef {import('@googleforcreators/elements').Page} Page
 */

/**
 * Async method to generate a dataUrl from a story page.
 */
async function storyPageToCanvas(page: Page, { width = 400, ...options }) {
  const htmlToImage = await import(
    /* webpackChunkName: "chunk-html-to-image" */ 'html-to-image'
  );

  const [node, cleanup] = await storyPageToNode(page, width, {
    renderFullHeightThumb: true,
  });

  const canvas = await htmlToImage.toCanvas(node, {
    ...options,
    fontEmbedCSS: '',
  });

  cleanup();

  return canvas;
}

export default storyPageToCanvas;
