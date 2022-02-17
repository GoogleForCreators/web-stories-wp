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
import { memo } from '@googleforcreators/react';
import {
  ContextMenuComponents,
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';

const IconButton = memo(function IconButton({ Icon, title, ...rest }) {
  return (
    <ContextMenuComponents.MenuButton {...rest}>
      <ContextMenuComponents.MenuIcon
        title={title}
        placement={TOOLTIP_PLACEMENT.BOTTOM}
      >
        <Icon />
      </ContextMenuComponents.MenuIcon>
    </ContextMenuComponents.MenuButton>
  );
});

IconButton.propTypes = {
  Icon: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default IconButton;
