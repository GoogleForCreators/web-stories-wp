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
import { Icons } from '@googleforcreators/design-system';
import { useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { canSupportMultiBorder } from '@googleforcreators/masks';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { DEFAULT_BORDER_RADIUS } from '../../panels/design/sizePosition/radius';
import {
  Input,
  Separator,
  useProperties,
  FocusTrapButton,
  handleReturnTrappedFocus,
} from './shared';

const CORNER_LABEL = __('Corner Radius', 'web-stories');
function BorderRadius() {
  const inputRef = useRef();
  const buttonRef = useRef();
  // Note that "mask" never updates on an element,
  // so selecting it cannot cause re-renders
  // We need it to determine if radii are supported.
  const {
    borderRadius = DEFAULT_BORDER_RADIUS,
    mask,
    type,
  } = useProperties(['borderRadius', 'mask', 'type']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  // Only multi-border elements support border radius
  const canHaveBorderRadius = canSupportMultiBorder({ mask });

  // We only allow editing the current border radii, if all corners are identical
  const hasUniformBorder =
    borderRadius.topLeft === borderRadius.topRight &&
    borderRadius.topLeft === borderRadius.bottomLeft &&
    borderRadius.topLeft === borderRadius.bottomRight;

  // Render nothing if radii not supported or not locked
  if (!canHaveBorderRadius || (!borderRadius.locked && !hasUniformBorder)) {
    return null;
  }

  const handleChange = (value) => {
    trackEvent('floating_menu', {
      name: 'set_border_radius',
      element: type,
    });

    updateSelectedElements({
      properties: {
        borderRadius: {
          locked: true,
          topLeft: value,
          topRight: value,
          bottomRight: value,
          bottomLeft: value,
        },
      },
    });
  };

  return (
    <FocusTrapButton
      ref={buttonRef}
      inputRef={inputRef}
      inputLabel={CORNER_LABEL}
    >
      <Input
        tabIndex={-1}
        ref={inputRef}
        suffix={<Icons.Corner />}
        value={borderRadius.topLeft}
        aria-label={CORNER_LABEL}
        onChange={(_, value) => handleChange(value)}
        onKeyDown={(e) => {
          handleReturnTrappedFocus(e, buttonRef);
        }}
      />
      <Separator />
    </FocusTrapButton>
  );
}

export default BorderRadius;
