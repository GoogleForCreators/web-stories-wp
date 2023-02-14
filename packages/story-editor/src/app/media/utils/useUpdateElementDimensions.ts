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
import { useCallback } from '@googleforcreators/react';
import type { Resource } from '@googleforcreators/media';
import type { ElementId, ElementType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import useStory from '../../story/useStory';
import getInsertedElementSize from '../../../utils/getInsertedElementSize';

function useUpdateElementDimensions() {
  const { updateElementsByResourceId } = useStory((state) => ({
    updateElementsByResourceId: state.actions.updateElementsByResourceId,
  }));

  const updateElementDimensions = useCallback(
    ({ id, resource }: { id: ElementId; resource: Resource }) => {
      updateElementsByResourceId({
        id,
        properties: (el) => {
          const hasChangedDimensions =
            el.resource.width !== resource.width ||
            el.resource.height !== resource.height;

          if (!hasChangedDimensions) {
            return {
              type: resource.type as unknown as ElementType,
              resource,
            };
          }

          const { width, height } = getInsertedElementSize(
            el.type,
            undefined,
            undefined,
            {},
            resource.width / resource.height,
            resource
          );

          return {
            resource,
            type: resource.type as unknown as ElementType,
            width,
            height,
          };
        },
      });
    },
    [updateElementsByResourceId]
  );

  return {
    updateElementDimensions,
  };
}

export default useUpdateElementDimensions;
