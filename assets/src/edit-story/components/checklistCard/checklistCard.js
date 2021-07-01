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
import { Headline, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { getGridVariant } from './helpers';
import {
  CARD_TYPE,
  MAX_THUMBNAILS_DISPLAYED,
  DEFAULT_OVERFLOW_LABEL,
} from './constants';

import {
  Wrapper,
  Container,
  Title,
  Cta,
  ThumbnailWrapper,
  StyledOverflowThumbnail,
  Footer,
} from './styles';

/**
 *
 * @param {Object} props Component props.
 * @param {string} props.cardType the type of card  getting rendered. Selected from constants > CARD_TYPE, defaults to SINGLE_ISSUE.
 * @param {string} props.className the className to be passed to the outermost element.
 * @param {string}  props.title text to display as title of card.
 * @param {Object}  props.titleProps if an object is passed in it should have an onClick, these are so that issues can have buttons as titles.
 * @param {Node} props.footer will  be rendered in the footer section of a card.
 * @param {Node} props.cta will be rendered as the cta section of a card.
 * @param {string} props.overflowLabel will be used as the aria label for the overflow thumbnail
 * @param {Node}  props.thumbnail will be rendered in the thumbnail section of a card.
 * @param  {number} props.thumbnailCount count of how  many thumbnails are getting rendered to use to manipulate grid. Defaults to 0.
 * @return {Node} card to  display.
 */
const ChecklistCard = ({
  cardType = CARD_TYPE.SINGLE_ISSUE,
  className,
  title,
  titleProps,
  footer,
  cta,
  overflowLabel = DEFAULT_OVERFLOW_LABEL,
  thumbnail,
  thumbnailCount = 0,
}) => {
  const gridVariant = getGridVariant({
    cardType,
    thumbnailCount,
    hasCta: Boolean(cta),
  });

  // Find out if there is overflow of thumbnails.
  // When there is overflow we are subtracting 1 thumbnail from the available grid space.
  const hasOverflowThumbnail =
    thumbnailCount > 0 && thumbnailCount > MAX_THUMBNAILS_DISPLAYED + 1;
  return (
    <Wrapper className={className}>
      <Container gridVariant={gridVariant}>
        <Title as={titleProps?.onClick ? 'button' : 'div'} {...titleProps}>
          <Headline
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL}
            as="h4"
          >
            {title}
          </Headline>
        </Title>
        <ThumbnailWrapper
          $isMultiple={thumbnailCount > 1}
          $colCount={hasOverflowThumbnail ? MAX_THUMBNAILS_DISPLAYED : 4}
        >
          {thumbnail}
        </ThumbnailWrapper>
        {hasOverflowThumbnail && (
          <StyledOverflowThumbnail
            screenReaderText={overflowLabel}
            overflowCount={thumbnailCount - MAX_THUMBNAILS_DISPLAYED}
          />
        )}
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
  overflowLabel: PropTypes.string,
  thumbnail: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.bool,
  ]),
  thumbnailCount: PropTypes.number,
  title: PropTypes.string.isRequired,
  titleProps: PropTypes.shape({ onClick: PropTypes.func }),
};

export default ChecklistCard;
