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
  Icons,
  themeHelpers,
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { VIEW_STYLE, VIEW_STYLE_LABELS } from '../../constants';
import { Tooltip } from '../tooltip';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ToggleButton = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${themeHelpers.focusableOutlineCSS}
  padding: 0;
  background: transparent;
  cursor: pointer;

  &:hover svg {
    color: ${({ theme }) => theme.colors.interactiveFg.hover};
  }
  &:active svg {
    color: ${({ theme }) => theme.colors.interactiveFg.active};
  }
`;

export default function ViewStyleBar({ onPress, layoutStyle }) {
  return (
    <Container>
      <Tooltip
        title={VIEW_STYLE_LABELS[layoutStyle]}
        placement={TOOLTIP_PLACEMENT.BOTTOM_END}
        hasTail
      >
        <ToggleButton
          aria-label={VIEW_STYLE_LABELS[layoutStyle]}
          onClick={onPress}
        >
          {layoutStyle === VIEW_STYLE.GRID && (
            <Icons.Table height="32px" width="32px" data-testid="list-icon" />
          )}
          {layoutStyle === VIEW_STYLE.LIST && (
            <Icons.Box4 height="32px" width="32px" data-testid="grid-icon" />
          )}
        </ToggleButton>
      </Tooltip>
    </Container>
  );
}

ViewStyleBar.propTypes = {
  onPress: PropTypes.func,
  layoutStyle: PropTypes.oneOf([VIEW_STYLE.GRID, VIEW_STYLE.LIST]).isRequired,
};
