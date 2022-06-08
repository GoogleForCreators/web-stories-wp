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
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  PLACEMENT,
} from '@googleforcreators/design-system';
import { forwardRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';

const StyledButton = styled(Button)`
  margin-top: 12px;
`;

function PageMenuButtonWithRef(
  { children, title, shortcut, ...rest },
  forwardedRef
) {
  return (
    <Tooltip
      title={title}
      shortcut={shortcut}
      placement={PLACEMENT.RIGHT}
      hasTail
    >
      <StyledButton
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        ref={forwardedRef}
        {...rest}
      >
        {children}
      </StyledButton>
    </Tooltip>
  );
}

const PageMenuButton = forwardRef(PageMenuButtonWithRef);

PageMenuButton.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  shortcut: PropTypes.string,
};

PageMenuButtonWithRef.propTypes = PageMenuButton.propTypes;

export default PageMenuButton;
