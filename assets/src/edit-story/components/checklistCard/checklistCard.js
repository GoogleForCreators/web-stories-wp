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

/**
 * Internal dependencies
 */

import { Headline, THEME_CONSTANTS } from '../../../design-system';
import { getCardType } from './helpers';
import { CARD_TYPE } from './constants';
import {
  Wrapper,
  Container,
  Title,
  Cta,
  ThumbnailWrapper,
  Helper,
} from './styles';

/**
 *
 * @param {Object} props Component props.
 * @param {string} props.cardType the type of card  getting rendered. Selected from constants > CARD_TYPE, defaults to SINGLE_ISSUE.
 * @param {string}  props.title text to display as title of card.
 * @param {Object}  props.titleProps if an object is passed in it should have an onClick, these are so that issues can have buttons as titles.
 * @param {Node} props.helper will  be rendered in the helper section of a card.
 * @param {Node} props.cta will be rendered as the cta section of a card.
 * @param {Node}  props.thumbnail will be rendered in the thumbnail section of a card.
 * @param  {number} props.thumbnailCount count of how  many thumbnails are getting rendered to use to manipulate grid. Defaults to 0.
 * @return {Node} card to  display.
 */
const ChecklistCard = ({
  cardType = CARD_TYPE.SINGLE_ISSUE,
  title,
  titleProps,
  helper,
  cta,
  thumbnail,
  thumbnailCount = 0,
}) => {
  const gridVariant = getCardType({ cardType, thumbnailCount });
  return (
    <Wrapper>
      <Container gridVariant={gridVariant}>
        <Title as={titleProps?.onClick ? 'button' : 'div'} {...titleProps}>
          <Headline
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
            as="h4"
          >
            {title}
          </Headline>
        </Title>
        <ThumbnailWrapper>{thumbnail}</ThumbnailWrapper>
        <Cta>{cta}</Cta>
        <Helper>{helper}</Helper>
      </Container>
    </Wrapper>
  );
};

ChecklistCard.propTypes = {
  cardType: PropTypes.oneOf(Object.values(CARD_TYPE)),
  title: PropTypes.string.isRequired,
  titleProps: PropTypes.shape({ onClick: PropTypes.func }),
  helper: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  cta: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  thumbnail: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  thumbnailCount: PropTypes.number,
};

export default ChecklistCard;
