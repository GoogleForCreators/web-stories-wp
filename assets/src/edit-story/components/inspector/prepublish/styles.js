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
import {
  Headline,
  Icons,
  Text,
  themeHelpers,
  THEME_CONSTANTS,
} from '../../../../design-system';
import { MAX_NUMBER_FOR_BADGE } from './constants';

function annotateNumber(number) {
  if (number <= MAX_NUMBER_FOR_BADGE) {
    return number;
  }
  return `${MAX_NUMBER_FOR_BADGE}+`;
}

export const NumberBadge = styled.span`
  display: inline-flex;
  height: 20px;
  width: 20px;
  line-height: 20px;
  justify-content: center;
  border-radius: 50%;
  font-size: ${({ number }) =>
    number > MAX_NUMBER_FOR_BADGE ? '10px' : '12px'};
  margin: auto 0 auto auto;
  &::after {
    content: ${({ number }) => `"${annotateNumber(number)}"`};
  }
  color: ${({ theme }) => theme.colors.bg.secondary};
  background-color: ${({ isRecommended, theme }) =>
    isRecommended ? theme.colors.fg.linkNormal : theme.colors.fg.negative};
`;
NumberBadge.propTypes = {
  isRecommended: PropTypes.bool,
  number: PropTypes.number,
};

const getPanelTitleColor = (isRecommended, isDisabled) => {
  if (isDisabled) {
    return 'disable';
  } else if (isRecommended) {
    return 'linkNormal';
  }
  return 'negative';
};
export const PanelTitle = styled(Headline).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
  as: 'span',
})`
  color: ${({ isRecommended, theme, isDisabled }) =>
    theme.colors.fg[getPanelTitleColor(isRecommended, isDisabled)]};
`;
PanelTitle.propTypes = {
  isRecommended: PropTypes.bool,
};

export const Row = styled.div`
  margin: 0 0 0 24px;
  padding: 0 0 22px 0;
`;

export const PageGroup = styled.div``;

export const GoToIssue = styled.span`
  height: 32px;
  width: 32px;
  margin: 0;
  color: ${({ theme }) => theme.colors.fg.primary};
  &:hover {
    color: ${({ theme }) => theme.colors.fg.primaryHover};
  }
`;

export const IssueTitle = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.standard.white};
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${themeHelpers.focusableOutlineCSS};

  &::before {
    content: '•';
    padding-right: 8px;
  }
`;

export const IssueDescription = styled.div`
  padding: 2px 0;
  margin-left: 12px;
  ul {
    list-style-type: none;
    margin: 0;
  }
  li {
    ${({ theme }) =>
      themeHelpers.expandPresetStyles({
        preset:
          theme.typography.presets.paragraph[
            THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
          ],
        theme,
      })}
    padding: 0 0 4px 0;
    margin: 0;
    &:last-of-type {
      padding-bottom: 0;
    }
  }
`;

export const PageIndicator = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
  isBold: true,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding: 8px 0;
  display: inline-block;
`;

export const EmptyLayout = styled.div`
  margin-top: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const Checkmark = styled(Icons.Checkmark)`
  margin-bottom: 16px;
  height: 64px;
  width: 64px;
  padding: 8px 15px 5px 17px;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.fg.positive};
  border: 1px solid ${({ theme }) => theme.colors.fg.positive};
  overflow: visible;
`;

export const EmptyHeading = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  color: ${({ theme }) => theme.colors.standard.white};
`;
