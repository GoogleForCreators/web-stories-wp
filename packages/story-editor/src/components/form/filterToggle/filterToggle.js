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
import {
  generatePatternStyles,
  PatternPropType,
} from '@googleforcreators/patterns';
import {
  THEME_CONSTANTS,
  BUTTON_TRANSITION_TIMING,
  Text,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { focusStyle } from '../../panels/shared/styles';

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
    width: 100%;
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
    ${focusStyle};

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

const Wrapper = styled.div`
  width: 60px;
`;

const StyledText = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.border.defaultActive};
  margin-top: 8px;
  text-align: center;
  width: 100%;
  display: block;
`;

function FilterToggle({ isToggled, filter = null, children, label, ...rest }) {
  return (
    <Wrapper>
      <Button {...rest} isToggled={isToggled} aria-pressed={isToggled}>
        {children}
        <Filter filter={filter} />
        <Overlay />
      </Button>
      {label && <StyledText>{label}</StyledText>}
    </Wrapper>
  );
}

FilterToggle.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  filter: PatternPropType,
  children: PropTypes.node.isRequired,
  label: PropTypes.string,
};

export default FilterToggle;
