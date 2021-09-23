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
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import Tooltip from '../../tooltip';

const StyledButton = styled(Button)`
  margin-top: 4px;
`;

function PageMenuButton({ children, title, shortcut, ...rest }) {
  return (
    <Tooltip title={title} shortcut={shortcut} hasTail>
      <StyledButton
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        {...rest}
      >
        {children}
      </StyledButton>
    </Tooltip>
  );
}

PageMenuButton.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  shortcut: PropTypes.string,
};

export default PageMenuButton;
