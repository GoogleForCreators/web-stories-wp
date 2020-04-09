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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */

import { ReactComponent as GridSVG } from '../icons/grid.svg';
import { ReactComponent as ListSVG } from '../icons/list.svg';
import { VIEW_STYLE, VIEW_STYLE_ICON_METRICS } from '../constants';

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ToggleButton = styled.button`
  border: none;
  padding: 15px;
  background: transparent;

  &:hover svg {
    color: ${({ theme }) => theme.colors.gray700};
  }
  &:active svg {
    color: ${({ theme }) => theme.colors.gray800};
  }
`;

const ListIcon = styled(ListSVG).attrs(VIEW_STYLE_ICON_METRICS)`
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const GridIcon = styled(GridSVG).attrs(VIEW_STYLE_ICON_METRICS)`
  color: ${({ theme }) => theme.colors.gray500};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.body2.family};
  letter-spacing: ${({ theme }) => theme.fonts.body2.letterSpacing};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  color: ${({ theme }) => theme.colors.gray500};
  margin-left: 20px;
`;

export default function ViewStyleBar({ onPress, label, layoutStyle }) {
  return (
    <Container>
      <ToggleButton
        aria-label={__(
          'Toggle between showing stories as a grid or list.',
          'web-stories'
        )}
        onClick={onPress}
      >
        {layoutStyle === VIEW_STYLE.GRID && <ListIcon />}
        {layoutStyle === VIEW_STYLE.LIST && <GridIcon />}
      </ToggleButton>
      <Label>{label}</Label>
    </Container>
  );
}

ViewStyleBar.propTypes = {
  onPress: PropTypes.func,
  label: PropTypes.string.isRequired,
  layoutStyle: PropTypes.oneOf([VIEW_STYLE.GRID, VIEW_STYLE.LIST]).isRequired,
};
