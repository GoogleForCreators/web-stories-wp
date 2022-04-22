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
import { SELECTED_ELEMENT_TYPES } from '../constants';
import Image from './image';
import Multiple from './multiple';
import Shape from './shape';
import Sticker from './sticker';
import Text from './text';
import Video from './video';
import Product from './product';

const FloatingMenuSelector = memo(function FloatingMenuSelector({
  selectedElementType,
}) {
  switch (selectedElementType) {
    case SELECTED_ELEMENT_TYPES.MULTIPLE:
      return <Multiple />;
    case SELECTED_ELEMENT_TYPES.GIF:
    case SELECTED_ELEMENT_TYPES.IMAGE:
      return <Image />;
    case SELECTED_ELEMENT_TYPES.SHAPE:
      return <Shape />;
    case SELECTED_ELEMENT_TYPES.STICKER:
      return <Sticker />;
    case SELECTED_ELEMENT_TYPES.TEXT:
      return <Text />;
    case SELECTED_ELEMENT_TYPES.VIDEO:
      // eslint-disable-next-line jsx-a11y/media-has-caption -- False positive
      return <Video />;
    case SELECTED_ELEMENT_TYPES.PRODUCT:
      return <Product />;
    default:
      return null;
  }
});

FloatingMenuSelector.propTypes = {
  selectedElementType: PropTypes.string.isRequired,
};

export default FloatingMenuSelector;
