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
 * Internal dependencies
 */
import { CARD_TYPE, GRID_VARIANT } from '../constants';

/**
 *
 * @param {Object} props props passed to function
 * @param {string} props.cardType type of card getting rendered.
 * @param {number} props.thumbnailCount how many thumbnails are getting rendered inside the card, defaults to 0.
 * @param {boolean} props.hasCta whether or not a card has a cta.
 * @return {string} type of card.
 */
export const getGridVariant = ({ cardType, thumbnailCount, hasCta }) => {
  if (cardType === CARD_TYPE.SINGLE_ISSUE) {
    return thumbnailCount > 0
      ? GRID_VARIANT.SINGLE_WITH_THUMBNAIL
      : GRID_VARIANT.SINGLE;
  }

  if (cardType === CARD_TYPE.MULTIPLE_ISSUE) {
    if (!thumbnailCount) {
      return GRID_VARIANT.DEFAULT;
    }
    if (hasCta) {
      return thumbnailCount <= 4
        ? GRID_VARIANT.MULTIPLE_WITH_THUMBNAIL_WITH_CTA
        : GRID_VARIANT.MULTIPLE_WITH_THUMBNAIL_WITH_CTA_OVERFLOW;
    }
    return thumbnailCount <= 4
      ? GRID_VARIANT.MULTIPLE_WITH_THUMBNAIL
      : GRID_VARIANT.MULTIPLE_WITH_THUMBNAIL_OVERFLOW;
  }
  return GRID_VARIANT.DEFAULT;
};
