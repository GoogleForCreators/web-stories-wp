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
  Toggle,
} from '@web-stories-wp/design-system';
import { MAX_NUMBER_FOR_BADGE } from '../constants';
import { focusStyle } from '../../../panels/shared';

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

export const PanelTitle = styled(Headline).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL,
  as: 'span',
})`
  color: ${({ isRecommended, theme }) =>
    isRecommended ? theme.colors.fg.linkNormal : theme.colors.fg.negative};
`;
PanelTitle.propTypes = {
  isRecommended: PropTypes.bool,
};

export const Row = styled.div`
  margin: 0 0 0 24px;
  padding: 0 0 22px 0;
`;

export const VideoOptimizationGroup = styled.div`
  margin-bottom: 16px;
`;

export const ToggleGroup = styled.div`
  display: flex;
  column-gap: 16px;

  label {
    line-height: 20px;
    max-width: 172px;
    cursor: pointer;
  }
`;

export const StyledToggle = styled(Toggle)`
  margin-top: 4px;
`;

export const PageGroup = styled.div``;

export const DescriptionText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin-bottom: 16px;
`;

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
  ${focusStyle};

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

export const EmptyHeading = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  color: ${({ theme }) => theme.colors.standard.white};
`;

export const EmptyPanelContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: -28px 14px 0; /* Need to line up percieved center with text rather than checkmark, using margin between elements as reference */
`;

export const EmptyPanelText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  text-align: center;
  max-width: 226px;
  margin-top: 28px;
`;

export const Checkmark = styled(Icons.CheckmarkCircle)`
  height: 50px;
  width: 50px;
  color: ${({ theme }) => theme.colors.fg.secondary};
`;
