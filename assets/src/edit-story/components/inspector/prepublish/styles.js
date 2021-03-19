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

export const TitleWrapper = styled.span`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

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
  margin: 0 16px;
  padding: 4px 0;
`;

export const PageGroup = styled.div`
  margin: 0 16px;

  ${Row} {
    margin-right: 0;
  }
`;

export const IssueTitle = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  color: ${({ theme }) => theme.colors.standard.white};
`;

export const IssueDescription = styled.div`
  padding: 4px 0;

  ul {
    list-style-type: '•';
    list-style-position: inside;
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
    &:before {
      content: '';
      padding-right: 4px;
    }
  }
`;

export const PageIndicator = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
  isBold: true,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding: 20px 0 8px;
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
