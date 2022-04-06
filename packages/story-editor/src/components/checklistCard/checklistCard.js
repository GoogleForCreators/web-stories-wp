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
import { Headline, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import ThumbnailWrapper from '../checklist/checks/shared/thumbnailWrapper';
import { getGridVariant } from './helpers';
import { CARD_TYPE } from './constants';
import { Wrapper, Container, Title, Cta, Footer } from './styles';

/**
 *
 * @param {Object} props Component props.
 * @param {string} props.cardType the type of card  getting rendered. Selected from constants > CARD_TYPE, defaults to SINGLE_ISSUE.
 * @param {string} props.className the className to be passed to the outermost element.
 * @param {string}  props.title text to display as title of card.
 * @param {Object}  props.titleProps if an object is passed in it should have an onClick, these are so that issues can have buttons as titles.
 * @param {Node} props.footer will  be rendered in the footer section of a card.
 * @param {Node} props.cta will be rendered as the cta section of a card.
 * @param {Node}  props.thumbnails array of thumbnails to be rendered in the thumbnail section of the card
 * @return {Node} card to display.
 */
const ChecklistCard = ({
  cardType = CARD_TYPE.SINGLE_ISSUE,
  className,
  title,
  titleProps,
  footer,
  cta,
  thumbnails,
}) => {
  let thumbnailCount = 0;
  if (thumbnails) {
    thumbnailCount = Array.isArray(thumbnails) ? thumbnails.length : 1;
  }

  const gridVariant = getGridVariant({
    cardType,
    thumbnailCount,
    hasCta: Boolean(cta),
  });

  return (
    <Wrapper className={className}>
      <Container gridVariant={gridVariant}>
        <Title as={titleProps?.onClick ? 'button' : 'div'} {...titleProps}>
          <Headline
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
            as="h2"
          >
            {title}
          </Headline>
        </Title>
        <ThumbnailWrapper>{thumbnails}</ThumbnailWrapper>
        <Cta>{cta}</Cta>
        <Footer>{footer}</Footer>
      </Container>
    </Wrapper>
  );
};

ChecklistCard.propTypes = {
  cardType: PropTypes.oneOf(Object.values(CARD_TYPE)),
  className: PropTypes.string,
  cta: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  thumbnails: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  title: PropTypes.string.isRequired,
  titleProps: PropTypes.shape({ onClick: PropTypes.func }),
};

export default ChecklistCard;
