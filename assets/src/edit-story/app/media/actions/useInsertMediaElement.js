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
import useInsertElement from '../../../elements/shared/useInsertElement';

function useInsertMediaElement({
  uploadVideoFrame,
  allowedImageMimeTypes,
  allowedVideoMimeTypes,
}) {
  const insertElement = useInsertElement();

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} attachment Attachment object
   * @param {number} width      Width that element is inserted into editor.
   * @param {boolean} isBackground Whether the element should be set as the background element.
   * @return {null|*}          Return onInsert or null.
   */
  const insertMediaElement = (attachment, width, isBackground = true) => {
    const { src, mimeType, oWidth, oHeight } = attachment;
    const origRatio = oWidth / oHeight;
    const height = width / origRatio;
    if (allowedImageMimeTypes.includes(mimeType)) {
      return insertElement('image', {
        src,
        width,
        height,
        x: 5,
        y: 5,
        rotationAngle: 0,
        origRatio,
        origWidth: oWidth,
        origHeight: oHeight,
        isBackground,
      });
    } else if (allowedVideoMimeTypes.includes(mimeType)) {
      const { id: videoId, poster, posterId: posterIdRaw } = attachment;
      const posterId = parseInt(posterIdRaw);
      const videoEl = insertElement('video', {
        src,
        width,
        height,
        x: 5,
        y: 5,
        rotationAngle: 0,
        origRatio,
        origWidth: oWidth,
        origHeight: oHeight,
        mimeType,
        videoId,
        posterId,
        poster,
        isBackground,
      });

      // Generate video poster if one not set.
      if (videoId && !posterId) {
        uploadVideoFrame(videoId, src, videoEl.id);
      }

      return videoEl;
    }
    return null;
  };

  return insertMediaElement;
}

export default useInsertMediaElement;
