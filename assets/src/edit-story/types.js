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
 * External dependencies
 */
import PropTypes from 'prop-types';

export const HexPropType = PropTypes.shape({
  r: PropTypes.number.isRequired,
  g: PropTypes.number.isRequired,
  b: PropTypes.number.isRequired,
  a: PropTypes.number,
});

export const ColorStopPropType = PropTypes.shape({
  color: HexPropType.isRequired,
  position: PropTypes.number.isRequired,
});

export const PatternPropType = PropTypes.shape({
  type: PropTypes.oneOf(['solid', 'linear', 'radial', 'conic']),
  color: HexPropType,
  stops: PropTypes.arrayOf(ColorStopPropType),
  rotation: PropTypes.number,
  center: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  size: PropTypes.shape({
    w: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
});

const StoryPropTypes = {};

StoryPropTypes.mask = PropTypes.shape({
  type: PropTypes.string.isRequired,
});

export const StoryElementPropsTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotationAngle: PropTypes.number.isRequired,
  isFill: PropTypes.bool,
  mask: StoryPropTypes.mask,
};

StoryPropTypes.size = PropTypes.exact({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
});

StoryPropTypes.box = PropTypes.exact({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotationAngle: PropTypes.number.isRequired,
});

StoryPropTypes.children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

StoryPropTypes.page = PropTypes.shape({
  id: PropTypes.string.isRequired,
});

export const StoryLayerPropsTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

StoryPropTypes.element = PropTypes.shape(StoryElementPropsTypes);

StoryPropTypes.layer = PropTypes.shape(StoryLayerPropsTypes);

StoryPropTypes.elements = {};

StoryPropTypes.elements.image = PropTypes.shape({
  ...StoryElementPropsTypes,
  src: PropTypes.string.isRequired,
  origRatio: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  focalX: PropTypes.number,
  focalY: PropTypes.number,
});

StoryPropTypes.elements.video = PropTypes.shape({
  ...StoryElementPropsTypes,
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  loop: PropTypes.bool,
  poster: PropTypes.string,
  videoId: PropTypes.number.isRequired,
  posterId: PropTypes.number,
});

StoryPropTypes.elements.text = PropTypes.shape({
  ...StoryElementPropsTypes,
  content: PropTypes.string,
  color: PatternPropType,
  backgroundColor: PatternPropType,
  fontFamily: PropTypes.string,
  fontFallback: PropTypes.array,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.number,
  fontStyle: PropTypes.string,
  letterSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lineHeight: PropTypes.number,
  padding: PropTypes.number,
  textAlign: PropTypes.string,
});

StoryPropTypes.elements.square = PropTypes.shape({
  ...StoryElementPropsTypes,
  backgroundColor: PatternPropType,
});

StoryPropTypes.elements.background = PropTypes.shape({
  ...StoryLayerPropsTypes,
  inner: StoryPropTypes.element,
});

export default StoryPropTypes;
