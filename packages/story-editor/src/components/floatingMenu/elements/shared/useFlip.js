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
/**
 * Internal dependencies
 */
import { useStory } from '../../../../app';
import useProperties from './useProperties';

function useFlip(property) {
  const { flip, type } = useProperties(['flip', 'type']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );
  const toggle = () => {
    trackEvent('floating_menu', {
      name: `set_flip_${property}`,
      element: type,
    });
    updateSelectedElements({
      properties: (oldElement) => ({
        flip: {
          ...oldElement.flip,
          [property]: !oldElement.flip[property] || false,
        },
      }),
    });
  };
  return {
    [property]: flip[property] || false,
    toggle,
  };
}

export default useFlip;
