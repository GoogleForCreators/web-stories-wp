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
 * Internal dependencies
 */
import preloadVideo from './preloadVideo';
import getImageFromVideo from './getImageFromVideo';
import seekVideo from './seekVideo';

/**
 * Returns an image of the first frame of a given video.
 *
 * @see https://github.com/ampproject/amp-wp/blob/c5fba13dd17d4f713c9889d26898aec6091e421b/assets/src/stories-editor/helpers/uploadVideoFrame.js#L10-L39
 * @param src Video src URL.
 * @return The extracted image.
 */
async function getFirstFrameOfVideo(src: string): Promise<Blob | null> {
  const video = await preloadVideo(src);
  await seekVideo(video);
  return getImageFromVideo(video);
}

export default getFirstFrameOfVideo;
