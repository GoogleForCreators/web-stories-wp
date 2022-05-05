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
import { __ } from '@googleforcreators/i18n';
import { useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { Color } from './shared';

function ShapeColor() {
  const { backgroundColor, updateSelectedElements } = useStory(
    ({ state, actions }) => ({
      backgroundColor: state.selectedElements[0].backgroundColor,
      updateSelectedElements: actions.updateSelectedElements,
    })
  );
  const pushUpdate = useCallback(
    (value) => {
      trackEvent('floating_menu', {
        name: 'set_shape_color',
        element: 'shape',
      });
      updateSelectedElements({
        properties: () => ({
          backgroundColor: value,
        }),
      });
    },
    [updateSelectedElements]
  );

  return (
    <Color
      tabIndex={-1}
      label={__('Shape color', 'web-stories')}
      value={backgroundColor}
      allowsSavedColors
      onChange={pushUpdate}
      hasInputs
      hasEyedropper
      allowsOpacity
      allowsGradient
      opacityFocusTrap
      colorFocusTrap
    />
  );
}

export default ShapeColor;
