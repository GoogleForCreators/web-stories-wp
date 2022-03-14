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
import PropTypes from 'prop-types';
import { forwardRef } from '@googleforcreators/react';
import {
  ContextMenuComponents,
  BUTTON_TYPES,
} from '@googleforcreators/design-system';

const ToggleButton = forwardRef(function ToggleButton(
  { isToggled, children, ...rest },
  ref
) {
  // Add extra properties to indicate this is a pushbutton, only if isToggled is a boolean
  const toggleProps =
    typeof isToggled === 'boolean'
      ? {
          type: isToggled ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.TERTIARY,
          'aria-pressed': isToggled,
        }
      : {};

  return (
    <ContextMenuComponents.MenuButton ref={ref} {...toggleProps} {...rest}>
      {children}
    </ContextMenuComponents.MenuButton>
  );
});

ToggleButton.propTypes = {
  isToggled: PropTypes.bool,
  children: PropTypes.node,
};

export default ToggleButton;
