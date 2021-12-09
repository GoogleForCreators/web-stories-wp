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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { Button } from '../../button';
import { menuItemStyles } from './styles';

const StyledButton = styled(Button)`
  ${menuItemStyles};

  width: 100%;
  border-radius: 0;
  background-color: transparent;

  :disabled {
    background-color: transparent;

    span {
      color: ${({ theme }) => theme.colors.fg.disable};
    }
  }

  :hover:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }

  :active:not(:disabled) {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
  }
`;

/**
 * A styled button for use in the context menu.
 *
 * @param {Object} props Attributes to pass to the button.
 * @return {Node} The react node
 */
function Item(props) {
  return <StyledButton role="menuitem" {...props} />;
}

Item.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Item;
