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
 * Internal dependencies
 */
import storyPageToNode from './storyPageToNode';

/**
 * @typedef {import('../../../types').Page} Page
 */

/**
 * Async method to generate a dataUrl from a story page.
 *
 * @param {Page} page Page object.
 * @param {Object} options options to pass to htmlToImage.toJpeg
 * @param {number} options.width desired width of image. Dictates height and container height
 * @return {Promise<string>} jpeg dataUrl
 */
async function storyPageToCanvas(page, { width = 400, ...options }) {
  const htmlToImage = await import(
    /* webpackChunkName: "chunk-html-to-image" */ 'html-to-image'
  );

  const [node, cleanup] = await storyPageToNode(page, width, {
    renderFullHeightThumb: true,
  });

  const canvas = await htmlToImage.toCanvas(node, {
    ...options,
    fontEmbedCss: '',
    pixelRatio: 1,
  });

  cleanup();

  return canvas;
}

export default storyPageToCanvas;
