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
import { getDefinitionForType } from '../../../../elements';
import { dataPixels } from '../../../../units';
import clamp from '../../../../utils/clamp';
import useSetupFor from '../../useSetupFor';
import useUpdateSelection from '../../useUpdateSelection';

import CONFIG from './config';

function useUpdateSize(isHorizontal) {
  const { value: lockAspectRatio } = useSetupFor(CONFIG.LOCKASPECTRATIO);

  const handleUpdateSize = useUpdateSelection(
    (value) => (element) => {
      const { width, height, type } = element;
      const clampedValue = clamp(
        value,
        isHorizontal ? CONFIG.WIDTH : CONFIG.HEIGHT
      );

      // Use resize rules if available to set width and height properly
      const { updateForResizeEvent } = getDefinitionForType(type);
      if (updateForResizeEvent) {
        return updateForResizeEvent(
          element,
          isHorizontal ? [1, 0] : [0, 1],
          isHorizontal ? clampedValue : width,
          !isHorizontal ? clampedValue : height
        );
      }

      // If no resize rule defined, check aspect ratio to set both width and height
      if (lockAspectRatio) {
        const ratio = width / height;
        if (isHorizontal) {
          return {
            width: clampedValue,
            height: clamp(dataPixels(value / ratio), CONFIG.HEIGHT),
          };
        } else {
          return {
            height: clampedValue,
            width: clamp(dataPixels(value * ratio), CONFIG.WIDTH),
          };
        }
      }

      // If no aspect ratio, just set value
      return isHorizontal ? { width: clampedValue } : { height: clampedValue };
    },
    [lockAspectRatio, isHorizontal]
  );
  return handleUpdateSize;
}

export default useUpdateSize;
