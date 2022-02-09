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
import { memo } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Image from './image';
import Mixed from './mixed';
import Shape from './shape';
import Sticker from './sticker';
import Text from './text';
import Video from './video';

const FloatingMenuSelector = memo(function FloatingMenuSelector({
  selectedElementTypes,
}) {
  if (selectedElementTypes.length > 1) {
    return <Mixed />;
  }

  const [selectedElementType] = selectedElementTypes;

  switch (selectedElementType) {
    case 'gif':
    case 'image':
      return <Image />;
    case 'shape':
      return <Shape />;
    case 'sticker':
      return <Sticker />;
    case 'text':
      return <Text />;
    case 'video':
      // Disable reason: False positive
      // eslint-disable-next-line jsx-a11y/media-has-caption
      return <Video />;
    default:
      return null;
  }
});

FloatingMenuSelector.propTypes = {
  selectedElementTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FloatingMenuSelector;
