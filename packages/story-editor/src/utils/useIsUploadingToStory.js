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
import { useMemo } from '@googleforcreators/react';
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useLocalMedia, useStory } from '../app';

function useIsUploadingToStory() {
  const resourceIds = useStory(({ state: { pages = [] } }) =>
    pages.reduce((acc, curr) => {
      acc.push(
        ...curr.elements
          .filter(
            ({ type, isExternal }) =>
              [
                ELEMENT_TYPES.IMAGE,
                ELEMENT_TYPES.VIDEO,
                ELEMENT_TYPES.GIF,
              ].includes(type) && !isExternal
          )
          .map(({ resource }) => resource.id)
      );
      return acc;
    }, [])
  );

  const { isCurrentResourceUploading, isCurrentResourceProcessing } =
    useLocalMedia(
      ({
        state: { isCurrentResourceUploading, isCurrentResourceProcessing },
      }) => ({
        isCurrentResourceUploading,
        isCurrentResourceProcessing,
      })
    );

  // TODO: What about video posters?
  return useMemo(() => {
    return Boolean(
      resourceIds?.some(
        (resourceId) =>
          isCurrentResourceUploading(resourceId) ||
          isCurrentResourceProcessing(resourceId)
      )
    );
  }, [resourceIds, isCurrentResourceUploading, isCurrentResourceProcessing]);
}

export default useIsUploadingToStory;
