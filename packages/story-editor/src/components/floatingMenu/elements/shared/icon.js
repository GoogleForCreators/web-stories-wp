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
import { memo, forwardRef } from '@googleforcreators/react';
import {
  ContextMenuComponents,
  Placement,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import Tooltip from '../../../tooltip';
import ToggleButton from './toggleButton';

const IconButton = memo(
  forwardRef(function IconButton(
    { Icon, title, hasTooltip = true, ...rest },
    ref
  ) {
    return (
      <Tooltip
        placement={Placement.Bottom}
        title={hasTooltip ? title : undefined}
      >
        <ToggleButton aria-label={title} ref={ref} tabIndex={-1} {...rest}>
          <ContextMenuComponents.MenuIcon title={title}>
            <Icon />
          </ContextMenuComponents.MenuIcon>
        </ToggleButton>
      </Tooltip>
    );
  })
);

IconButton.propTypes = {
  Icon: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  hasTooltip: PropTypes.bool,
  title: PropTypes.string,
};

export default IconButton;
