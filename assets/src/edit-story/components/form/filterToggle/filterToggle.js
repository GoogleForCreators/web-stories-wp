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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../../../design-system/theme';
import { BUTTON_TRANSITION_TIMING } from '../../../../design-system/components/button';
import generatePatternStyles from '../../../utils/generatePatternStyles';
import { PatternPropType } from '../../../types';

const fillCss = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const Overlay = styled.div`
  ${fillCss};
`;

const Filter = styled.div`
  ${fillCss};
  ${({ filter }) => generatePatternStyles(filter)};
`;

const Button = styled.button(
  ({ theme }) => css`
    border-radius: ${theme.borders.radius.small};
    width: 60px;
    height: 48px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    ${themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};

    img {
      width: 100%;
      height: 100%;
      border-radius: ${theme.borders.radius.small};
    }

    ${Overlay} {
      ${({ isToggled }) =>
        isToggled &&
        `
        box-shadow:
          0px 0px 0 2px ${theme.colors.bg.secondary},
          0px 0px 0 3px ${theme.colors.fg.primary}`};
    }

    &:active > ${Overlay} {
      box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary},
        0px 0px 0 3px ${theme.colors.fg.primary};
    }

    &:disabled {
      pointer-events: none;
      ${Overlay} {
        background-color: ${theme.colors.opacity.black64};
      }
    }

    transition: background-color ${BUTTON_TRANSITION_TIMING},
      color ${BUTTON_TRANSITION_TIMING};
  `
);

function FilterToggle({ isToggled, filter, children, ...rest }) {
  return (
    <Button {...rest} isToggled={isToggled} aria-pressed={isToggled}>
      {children}
      <Filter filter={filter} />
      <Overlay />
    </Button>
  );
}

FilterToggle.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  filter: PatternPropType.isRequired,
  children: PropTypes.node.isRequired,
};

export default FilterToggle;
