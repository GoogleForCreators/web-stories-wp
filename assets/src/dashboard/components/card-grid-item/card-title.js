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

const StyledCardTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  font-family: ${({ theme }) => theme.fonts.storyGridItem.family};
  font-size: ${({ theme }) => theme.fonts.storyGridItem.size};
  font-weight: ${({ theme }) => theme.fonts.storyGridItem.weight};
  letter-spacing: ${({ theme }) => theme.fonts.storyGridItem.letterSpacing};
  line-height: ${({ theme }) => theme.fonts.storyGridItem.lineHeight};
  width: 100%;
`;

const StyledTitle = styled.p`
  color: ${({ theme }) => theme.colors.gray900};
  margin: 0;
`;

const StyledDate = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray500};
  font-family: ${({ theme }) => theme.fonts.storyGridItemSub.weight};
  font-family: ${({ theme }) => theme.fonts.storyGridItemSub.family};
`;

// TODO this needs date handling
// TODO modify to handle other types of card titles - not just own stories
const CardTitle = ({ title, modifiedDate }) => (
  <StyledCardTitle>
    <StyledTitle>{title}</StyledTitle>
    <StyledDate>{`
      ${__('Modified', 'web-stories')} ${modifiedDate} `}</StyledDate>
  </StyledCardTitle>
);

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  modifiedDate: PropTypes.string.isRequired,
};

export default CardTitle;
