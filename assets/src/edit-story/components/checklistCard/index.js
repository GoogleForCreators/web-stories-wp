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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  Headline,
  Text,
  THEME_CONSTANTS,
} from '../../../design-system';
import { focusableOutlineCSS } from '../../../design-system/theme/helpers';

const CARD_TYPE = {
  SINGLE_ISSUE: 'single_issue',
  MULTIPLE_ISSUE: 'multiple_issue',
};
const GRID_VARIANT = {
  SINGLE_WITH_THUMBNAIL: 'single_with_thumbnail',
  SINGLE: 'single',
  DEFAULT: 'single',
};

const Wrapper = styled.div`
  width: 272px;
  display: flex;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg.secondary};
`;

const getGridTemplateAreas = (gridVariant) => {
  switch (gridVariant) {
    case GRID_VARIANT.SINGLE:
      return "'title title' 'cta thumbnail' 'helper helper'";
    case GRID_VARIANT.SINGLE_WITH_THUMBNAIL:
      return "'title thumbnail' 'cta thumbnail' 'helper helper'";

    default:
      return "'title thumbnail' 'cta thumbnail' 'helper helper'";
  }
};
const Container = styled.div`
  width: 240px;
  display: grid;
  margin: 16px;
  grid-gap: 8px;
  grid-template-columns: 180px 52px;
  ${({ gridVariant }) => css`
    grid-template-areas: ${getGridTemplateAreas(gridVariant)};
  `}
`;
const Title = styled.div`
  grid-area: title;

  &:is(button) {
    outline: none;
    margin: 0;
    padding: 0;
    background-color: transparent;
    border: none;
    text-align: left;
    cursor: 'pointer';
    border-radius: ${({ theme }) => theme.borders.radius.small};
    ${focusableOutlineCSS}
  }
`;

const Cta = styled.div`
  grid-area: cta;
  margin: 0;
`;
const ThumbnailWrapper = styled.div`
  grid-area: thumbnail;
`;
const Helper = styled.div`
  grid-area: helper;
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider.primary};
`;

const getCardType = ({ cardType, thumbnailCount }) => {
  if (cardType === CARD_TYPE.SINGLE_ISSUE) {
    return thumbnailCount > 0
      ? GRID_VARIANT.SINGLE_WITH_THUMBNAIL
      : GRID_VARIANT.SINGLE;
  }
  return GRID_VARIANT.DEFAULT;
};

const SingleIssueCard = ({
  cardType = CARD_TYPE.SINGLE_ISSUE,
  title,
  titleProps,
  helper,
  cta,
  Thumbnail,
  thumbnailCount = 0,
}) => {
  const gridVariant = getCardType({ cardType, thumbnailCount });
  return (
    <Wrapper>
      <Container gridVariant={gridVariant}>
        <Title as={titleProps ? 'button' : 'div'} {...titleProps}>
          <Headline
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
            as="h4"
          >
            {title}
          </Headline>
        </Title>
        <ThumbnailWrapper>{Thumbnail}</ThumbnailWrapper>
        <Cta>{cta}</Cta>
        <Helper>{helper}</Helper>
      </Container>
    </Wrapper>
  );
};

export default SingleIssueCard;
