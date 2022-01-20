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
import {
  Headline,
  THEME_CONSTANTS,
  themeHelpers,
  Button,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';

export const TaxonomyPropType = PropTypes.shape({
  capabilities: PropTypes.object,
  description: PropTypes.string,
  hierarchical: PropTypes.bool,
  labels: PropTypes.object,
  name: PropTypes.string.isRequired,
  restBase: PropTypes.string.isRequired,
  showCloud: PropTypes.bool,
  slug: PropTypes.string.isRequired,
  types: PropTypes.arrayOf(PropTypes.string),
  visibility: PropTypes.object,
});

export const ContentHeading = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  margin: 4px 0 16px;
  font-weight: ${({ theme }) => theme.typography.weight.regular};
`;

export const LinkButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.LINK,
})`
  ${themeHelpers.expandTextPreset(({ link }, { X_SMALL }) => link[X_SMALL])}
  margin-bottom: 16px;
  font-weight: 500;
`;

export const SiblingBorder = styled.div`
  padding-left: 16px;
  padding-right: 16px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.divider.tertiary};
    padding-top: 16px;
    padding-bottom: 8px;
  }
`;

export const WordCloud = {
  Heading: styled(ContentHeading).attrs({ as: 'h4' })`
    margin-bottom: 4px;
  `,
  Wrapper: styled.div`
    padding: 18px 0px;
  `,
  List: styled.ul`
    all: unset;
    /* Only adding this here to prevent cursor flash between text/pointer when hovering*/
    cursor: pointer;
  `,
  ListItem: styled.li`
    all: unset;
  `,
  Word: styled(LinkButton)`
    margin: 0;
    display: revert;
  `,
};
