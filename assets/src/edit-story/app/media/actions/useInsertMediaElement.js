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

function useInsertMediaElement({ uploadVideoFrame }) {
  const insertElement = useInsertElement();

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @param {number} width Width that element is inserted into editor.
   * @param {number} height Height that element is inserted into editor.
   * @param {boolean} isBackground Whether the element should be set as the background element.
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = (resource, width, height, isBackground = true) => {
    const element = insertElement(
      resource.type,
      {
        resource,
        width,
        height,
        x: 5,
        y: 5,
        rotationAngle: 0,
      },
      isBackground
    );

    // Generate video poster if one not set.
    if (resource.type === 'video' && resource.videoId && !resource.posterId) {
      uploadVideoFrame(resource.videoId, resource.src, element.id);
    }

    return element;
  };

  return insertMediaElement;
}

export default useInsertMediaElement;
