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
import { useCallback, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { CONTEXT_MENU_SKIP_ELEMENT } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import {
  Color,
  FocusTrapButton,
  handleReturnTrappedColorFocus,
} from './shared';

const SHAPE_COLOR_LABEL = __('Shape color', 'web-stories');

function ShapeColor() {
  const inputRef = useRef();
  const buttonRef = useRef();

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
    <FocusTrapButton
      ref={buttonRef}
      inputRef={inputRef}
      inputLabel={SHAPE_COLOR_LABEL}
    >
      <Color
        tabIndex={-1}
        ref={inputRef}
        label={SHAPE_COLOR_LABEL}
        value={backgroundColor}
        allowsSavedColors
        onChange={pushUpdate}
        hasInputs
        hasEyedropper
        allowsOpacity
        allowsGradient
        className={CONTEXT_MENU_SKIP_ELEMENT}
        onKeyDown={(e, containerRef) =>
          handleReturnTrappedColorFocus(e, buttonRef, containerRef)
        }
      />
    </FocusTrapButton>
  );
}

export default ShapeColor;
