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
import { Headline, THEME_CONSTANTS } from '@web-stories-wp/design-system';

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
  _links: PropTypes.object,
});

export const ContentHeading = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  margin: 4px 0 16px;
  font-weight: ${({ theme }) => theme.typography.weight.regular};
`;
