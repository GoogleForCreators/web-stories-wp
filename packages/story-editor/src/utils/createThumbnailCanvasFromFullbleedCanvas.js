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
import { PAGE_RATIO } from '@googleforcreators/units';

/**
 * Creates a thumbnail aspect ratio canvas when given a fullbleed aspect
 * ratio canvas.
 *
 * @param {HTMLCanvasElement} fullbleedCanvas fullbleed aspect ratio canvas element
 * @return {HTMLCanvasElement} a new thumbnail aspect ratio canvas element
 */
function createThumbnailCanvasFromFullbleedCanvas(fullbleedCanvas) {
  const thumbnailCanvas = document.createElement('canvas');
  const thumbnailContext = thumbnailCanvas.getContext('2d');

  const fullbleedHeight = Number(fullbleedCanvas.height);
  const thumbnailHeight = Number(fullbleedCanvas.width) / PAGE_RATIO;
  const dy = (fullbleedHeight - thumbnailHeight) / 2;
  thumbnailCanvas.width = fullbleedCanvas.width;
  thumbnailCanvas.height = thumbnailHeight;
  thumbnailContext.drawImage(fullbleedCanvas, 0, -dy);

  return thumbnailCanvas;
}

export default createThumbnailCanvasFromFullbleedCanvas;
