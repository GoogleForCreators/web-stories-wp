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

/**
 * Internal dependencies
 */

import { Grid as GridSVG, List as ListSVG } from '../../icons';
import { ICON_METRICS, VIEW_STYLE, VIEW_STYLE_LABELS } from '../../constants';
import Tooltip from '../tooltip';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const ToggleButton = styled.button`
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;

  &:hover svg {
    color: ${({ theme }) => theme.colors.gray700};
  }
  &:active svg {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;

const ListIcon = styled(ListSVG).attrs(ICON_METRICS.VIEW_STYLE)`
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const GridIcon = styled(GridSVG).attrs(ICON_METRICS.VIEW_STYLE)`
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export default function ViewStyleBar({ onPress, layoutStyle, ariaLabel }) {
  return (
    <Container>
      <Tooltip content={VIEW_STYLE_LABELS[layoutStyle]} position="right">
        <ToggleButton aria-label={ariaLabel} onClick={onPress}>
          {layoutStyle === VIEW_STYLE.GRID && (
            <ListIcon data-testid="list-icon" />
          )}
          {layoutStyle === VIEW_STYLE.LIST && (
            <GridIcon data-testid="grid-icon" />
          )}
        </ToggleButton>
      </Tooltip>
    </Container>
  );
}

ViewStyleBar.propTypes = {
  ariaLabel: PropTypes.string,
  onPress: PropTypes.func,
  layoutStyle: PropTypes.oneOf([VIEW_STYLE.GRID, VIEW_STYLE.LIST]).isRequired,
};
