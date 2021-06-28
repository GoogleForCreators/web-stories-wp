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
import { sprintf, __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, Text, VisuallyHidden } from '../../../design-system';
import { Container } from './styles';

/**
 * Element and page thumbnails, used in the prepublish checklist
 *
 * @param {Object} props Component props.
 * @param {string} props.screenReaderText Text that is not rendered on the screen to give context to those using screen readers.
 * @param {number} props.overflowCount The number of thumbnails that are overflowing.
 * @return {Node} Overflow Thumbnail to render
 */
const OverflowThumbnail = ({ overflowCount, screenReaderText, ...rest }) => (
  <Container $isOverflow as="div" {...rest}>
    <VisuallyHidden>{screenReaderText}</VisuallyHidden>
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
  screenReaderText: PropTypes.string.isRequired,
  overflowCount: PropTypes.number.isRequired,
};
export default OverflowThumbnail;
