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
import { sprintf, __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import { THEME_CONSTANTS, Text } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { Container } from './styles';

/**
 * Element and page thumbnails, used in the prepublish checklist
 *
 * @param {Object} props Component props.
 * @param {number} props.overflowCount The number of thumbnails that are overflowing.
 * @return {Node} Overflow Thumbnail to render
 */
const OverflowThumbnail = ({ overflowCount, ...rest }) => (
  <Container $isOverflow as="div" {...rest}>
    <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}>
      {sprintf(
        /* translators: %s: number of thumbnails in overflow */
        __('+ %s', 'web-stories'),
        overflowCount
      )}
    </Text>
  </Container>
);

OverflowThumbnail.propTypes = {
  overflowCount: PropTypes.number.isRequired,
};
export default OverflowThumbnail;
