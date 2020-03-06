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

const StoryPropTypes = {};

StoryPropTypes.mask = PropTypes.shape({
  type: PropTypes.string.isRequired,
});

StoryPropTypes.link = PropTypes.shape({
  type: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
  desc: PropTypes.string,
  icon: PropTypes.string,
});

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

StoryPropTypes.imageResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  mimeType: PropTypes.string.isRequired,
});

StoryPropTypes.videoResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  mimeType: PropTypes.string.isRequired,
  videoId: PropTypes.number.isRequired,
  poster: PropTypes.string,
  posterId: PropTypes.number,
});

StoryPropTypes.resource = PropTypes.oneOfType([
  StoryPropTypes.imageResource,
  StoryPropTypes.videoResource,
]);

const StoryLayerPropTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const StoryElementPropsTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotationAngle: PropTypes.number.isRequired,
  isFill: PropTypes.bool,
  mask: StoryPropTypes.mask,
  link: StoryPropTypes.link,
};

StoryPropTypes.element = PropTypes.shape(StoryElementPropsTypes);

StoryPropTypes.layer = PropTypes.shape(StoryLayerPropTypes);

StoryPropTypes.elements = {};

StoryPropTypes.elements.image = PropTypes.shape({
  ...StoryElementPropsTypes,
  resource: StoryPropTypes.imageResource,
  scale: PropTypes.number.isRequired,
  focalX: PropTypes.number,
  focalY: PropTypes.number,
});

StoryPropTypes.elements.video = PropTypes.shape({
  ...StoryElementPropsTypes,
  resource: StoryPropTypes.videoResource,
  loop: PropTypes.bool,
});

StoryPropTypes.elements.text = PropTypes.shape({
  ...StoryElementPropsTypes,
  content: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
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

StoryPropTypes.elements.shape = PropTypes.shape({
  ...StoryElementPropsTypes,
  backgroundColor: PropTypes.string,
});

StoryPropTypes.elements.background = PropTypes.shape({
  ...StoryLayerPropTypes,
  inner: StoryPropTypes.element,
});

export default StoryPropTypes;
