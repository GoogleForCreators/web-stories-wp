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
/**
 * Internal dependencies
 */
import { AnimationProps } from '../dashboard/animations/parts/types';
import { OverlayType } from './utils/backgroundOverlay';
import { BACKGROUND_TEXT_MODE } from './constants';
import MULTIPLE_VALUE from './components/form/multipleValue';

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
  type: PropTypes.oneOf(['solid', 'linear', 'radial']),
  color: HexPropType,
  stops: PropTypes.arrayOf(ColorStopPropType),
  rotation: PropTypes.number,
  alpha: PropTypes.number,
  center: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  size: PropTypes.shape({
    w: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
});

export const StylePresetPropType = PropTypes.shape({
  fillColors: PropTypes.array,
  textColors: PropTypes.array,
  textStyles: PropTypes.array,
});

const StoryPropTypes = {};

StoryPropTypes.story = PropTypes.shape({
  storyId: PropTypes.number,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  author: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  featuredMedia: PropTypes.number.isRequired,
  password: PropTypes.string.isRequired,
  autoAdvance: PropTypes.bool,
  defaultPageDuration: PropTypes.number,
});

StoryPropTypes.mask = PropTypes.shape({
  type: PropTypes.string.isRequired,
});

StoryPropTypes.link = PropTypes.shape({
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

StoryPropTypes.page = PropTypes.shape({
  id: PropTypes.string.isRequired,
  animations: PropTypes.arrayOf(PropTypes.shape(AnimationProps)),
  elements: PropTypes.arrayOf(PropTypes.shape(StoryPropTypes.element)),
  backgroundOverlay: PropTypes.oneOf(Object.values(OverlayType)),
});

StoryPropTypes.imageResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.number,
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
});

StoryPropTypes.videoResource = PropTypes.shape({
  type: PropTypes.string.isRequired,
  id: PropTypes.number,
  mimeType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  poster: PropTypes.string,
  posterId: PropTypes.number,
  alt: PropTypes.string,
  title: PropTypes.string,
});

StoryPropTypes.resource = PropTypes.oneOfType([
  StoryPropTypes.imageResource,
  StoryPropTypes.videoResource,
]);

const StoryLayerPropTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

StoryPropTypes.flip = PropTypes.shape({
  vertical: PropTypes.bool,
  horizontal: PropTypes.bool,
});

const StoryElementPropTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  flip: StoryPropTypes.flip,
  rotationAngle: PropTypes.number.isRequired,
  mask: StoryPropTypes.mask,
  link: StoryPropTypes.link,
  opacity: PropTypes.number,
  lockAspectRatio: PropTypes.bool,
};

const StoryMediaPropTypes = {
  scale: PropTypes.number.isRequired,
  focalX: PropTypes.number,
  focalY: PropTypes.number,
};

StoryPropTypes.element = PropTypes.shape(StoryElementPropTypes);

StoryPropTypes.layer = PropTypes.shape(StoryLayerPropTypes);

StoryPropTypes.elements = {};

StoryPropTypes.elements.image = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: StoryPropTypes.imageResource,
});

StoryPropTypes.elements.video = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: StoryPropTypes.videoResource,
  poster: PropTypes.string,
  loop: PropTypes.bool,
});

StoryPropTypes.elements.media = PropTypes.oneOfType([
  StoryPropTypes.elements.image,
  StoryPropTypes.elements.video,
]);

export const FontPropType = PropTypes.shape({
  family: PropTypes.string,
  service: PropTypes.string,
  weights: PropTypes.arrayOf(PropTypes.number),
  styles: PropTypes.arrayOf(PropTypes.string),
  // There's no built-in prop type validation for tuples.
  variants: PropTypes.arrayOf(PropTypes.array),
  fallbacks: PropTypes.array,
});

export const PaddingPropType = PropTypes.shape({
  horizontal: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([MULTIPLE_VALUE]),
  ]),
  vertical: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf([MULTIPLE_VALUE]),
  ]),
  locked: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf([MULTIPLE_VALUE]),
  ]),
});

StoryPropTypes.elements.text = PropTypes.shape({
  ...StoryElementPropTypes,
  content: PropTypes.string,
  backgroundTextMode: PropTypes.oneOf(Object.values(BACKGROUND_TEXT_MODE)),
  backgroundColor: PatternPropType,
  font: FontPropType.isRequired,
  fontSize: PropTypes.number,
  lineHeight: PropTypes.number,
  padding: PaddingPropType,
  textAlign: PropTypes.string,
});

StoryPropTypes.elements.shape = PropTypes.shape({
  ...StoryElementPropTypes,
  backgroundColor: PatternPropType,
});

StoryPropTypes.elements.background = PropTypes.shape({
  ...StoryLayerPropTypes,
  inner: StoryPropTypes.element,
});

export default StoryPropTypes;

/**
 * Page object.
 *
 * @typedef {Page} Page
 * @property {Array} elements Array of all elements.
 */

/**
 * Story object.
 *
 * @typedef {Story} Story
 * @property {Object} story - A story object.
 * @property {number} storyId Story post id.
 * @property {string} title Story title.
 * @property {string} status Post status, draft or published.
 * @property {Array<Page>} pages Array of all pages.
 * @property {number} author User ID of story author.
 * @property {string} slug The slug of the story.
 * @property {string} date The publish date of the story.
 * @property {string} modified The modified date of the story.
 * @property {string} content AMP HTML content.
 * @property {string} excerpt Short description.
 * @property {number} featuredMedia Featured media ID.
 * @property {string} password Password
 */
