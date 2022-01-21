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
import { useCallback } from '@googleforcreators/react';
import { resourceList } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import useLibrary from '../../../useLibrary';

function useOnMediaSelect() {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  /**
   * Insert element such image, video and audio into the editor.
   *
   * @param {Object} resource Resource object
   * @param {string} thumbnailURL The thumbnail's url
   * @return {null|*} Return onInsert or null.
   */
  const insertMediaElement = useCallback(
    (resource, thumbnailURL) => {
      resourceList.set(resource.id, {
        url: thumbnailURL,
        type: 'cached',
      });
      insertElement(resource.type, { resource });
    },
    [insertElement]
  );

  /**
   * Callback of select in media picker to insert media element.
   *
   * @param {Object} resource Object coming from backbone media picker.
   */
  const onSelect = useCallback(
    (resource) => {
      // WordPress media picker event, sizes.medium.source_url is the smallest image
      insertMediaElement(
        resource,
        resource.sizes?.medium?.source_url || resource.src
      );
    },
    [insertMediaElement]
  );

  return { insertMediaElement, onSelect };
}

export default useOnMediaSelect;
