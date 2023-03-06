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
import { trackEvent } from '@googleforcreators/tracking';
import type { Flip } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import useProperties from './useProperties';

function useFlip(property: keyof Flip) {
  const { flip, type } = useProperties(['flip', 'type']);

  const { selectedElementIds, updateElementsById } = useStory(
    ({ state, actions }) => ({
      selectedElementIds: state.selectedElementIds,
      updateElementsById: actions.updateElementsById,
    })
  );

  const toggle = () => {
    void trackEvent('floating_menu', {
      name: `set_flip_${property}`,
      element: type as unknown as string,
    });
    updateElementsById({
      elementIds: selectedElementIds,
      properties: (oldElement) => ({
        flip: {
          ...oldElement.flip,
          [property]: Boolean(!oldElement.flip?.[property] || false),
        } as Flip,
      }),
    });
  };

  return {
    [property]: flip?.[property] || false,
    toggle,
  };
}

export default useFlip;
