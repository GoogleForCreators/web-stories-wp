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
import styled, { css } from 'styled-components';
import { forwardRef } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, themeHelpers } from '../../../theme';
import { defaultTypographyStyle } from '../styles';
import { Launch } from '../../../icons';

const StyledLaunch = styled(Launch)`
  width: 12px;
  margin-left: 0.5ch;
  margin-bottom: 2px;
  stroke-width: 0;
  vertical-align: text-bottom;
`;

export const StyledAnchor = styled.a`
  ${({ size, theme }) => css`
    ${defaultTypographyStyle};
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.link[size],
      theme,
    })};

    color: ${theme.colors.fg.linkNormal};
    text-decoration: none;
    cursor: pointer;
    vertical-align: baseline;

    :hover {
      color: ${theme.colors.fg.linkHover};
    }
    :focus {
      /* Override WordPress's common css */
      color: ${theme.colors.fg.linkNormal} !important;
    }

    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)}
  `};
`;

function ConditionalSpanWrapper({ isWrapped, children }) {
  return isWrapped ? <span>{children}</span> : children;
}
ConditionalSpanWrapper.propTypes = {
  children: PropTypes.node,
  isWrapped: PropTypes.bool,
};

const Link = forwardRef(function Link({ children, ...props }, ref) {
  const isExternalLink = props.target === '_blank';
  return (
    <StyledAnchor ref={ref} {...props}>
      <ConditionalSpanWrapper isWrapped={isExternalLink}>
        {children}
        {isExternalLink && <StyledLaunch />}
      </ConditionalSpanWrapper>
    </StyledAnchor>
  );
});
Link.propTypes = {
  children: PropTypes.node,
  target: PropTypes.string,
  size: PropTypes.oneOf(THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES),
};
Link.defaultProps = {
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM,
};

export { Link };
