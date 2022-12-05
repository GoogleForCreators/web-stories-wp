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
import getCanvasBlob from './getCanvasBlob';

/**
 * Returns a still image from a given video element.
 *
 * @param video Video element.
 * @return JPEG image blob.
 */
function getImageFromVideo(video: HTMLVideoElement): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');

  // If the contextType doesn't match a possible drawing context,
  // or differs from the first contextType requested, null is returned.
  if (!ctx) {
    return Promise.resolve(null);
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return getCanvasBlob(canvas);
}

export default getImageFromVideo;
