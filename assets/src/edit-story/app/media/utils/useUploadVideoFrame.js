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
import { uploadFile } from '../../uploader/useUploader';
import { preloadImage, getFirstFrameOfVideo } from './';

export async function uploadVideoFrame({
  id,
  src,
  state: { config, pagingNum, mediaType, searchTerm },
  actions: {
    getMedia,
    uploadMediaAPI,
    updateMedia,
    updateElementsByResourceId,
    resetFilters,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    updateMediaElement,
  },
}) {
  try {
    const obj = await getFirstFrameOfVideo(src);
    const {
      id: posterId,
      source_url: poster,
      media_details: { width: posterWidth, height: posterHeight },
    } = await uploadFile({
      file: obj,
      refreshLibrary: false,
      state: { config, mediaType, searchTerm, pagingNum },
      actions: {
        getMedia,
        resetFilters,
        uploadMediaAPI,
        fetchMediaStart,
        fetchMediaSuccess,
        fetchMediaError,
      },
    });
    await updateMedia(posterId, {
      meta: {
        web_stories_is_poster: true,
      },
    });
    await updateMedia(id, {
      featured_media: posterId,
      post: config.storyId,
    });

    // Preload the full image in the browser to stop jumping around.
    await preloadImage(poster);

    // Overwrite the original video dimensions. The poster reupload has more
    // accurate dimensions of the video that includes orientation changes.
    const newSize =
      (posterWidth &&
        posterHeight && {
          width: posterWidth,
          height: posterHeight,
        }) ||
      null;
    const newState = ({ resource }) => ({
      resource: {
        ...resource,
        posterId,
        poster,
        ...newSize,
      },
    });
    updateElementsByResourceId(id, newState);
    updateMediaElement({
      id,
      posterId,
      poster,
      ...newSize,
    });
  } catch (err) {
    // TODO Display error message to user as video poster upload has as failed.
    console.warn(err);
  }
}
