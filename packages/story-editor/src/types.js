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
import { PatternPropType } from '@web-stories-wp/patterns';
import { ResourcePropTypes } from '@web-stories-wp/media';
import { AnimationProps } from '@web-stories-wp/animation';

/**
 * Internal dependencies
 */
import { OverlayType } from './utils/overlay';
import { BACKGROUND_TEXT_MODE, MULTIPLE_VALUE } from './constants';

export const PageSizePropType = PropTypes.shape({
  width: PropTypes.number,
  height: PropTypes.number,
  containerHeight: PropTypes.number,
});

const StoryPropTypes = {};

export const BackgroundAudioPropType = PropTypes.shape({
  id: PropTypes.number,
  src: PropTypes.string,
  mimeType: PropTypes.string,
});

StoryPropTypes.story = PropTypes.shape({
  storyId: PropTypes.number,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  author: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string.isRequired,
  }),
  slug: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  modified: PropTypes.string.isRequired,
  excerpt: PropTypes.string.isRequired,
  featuredMedia: PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
  password: PropTypes.string.isRequired,
  currentStoryStyles: PropTypes.object,
  autoAdvance: PropTypes.bool,
  defaultPageDuration: PropTypes.number,
  backgroundAudio: BackgroundAudioPropType,
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
  overlay: PropTypes.oneOf(Object.values(OverlayType)),
  backgroundAudio: BackgroundAudioPropType,
});

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
  isBackground: PropTypes.bool,
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
  resource: ResourcePropTypes.imageResource,
});

StoryPropTypes.elements.video = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: ResourcePropTypes.videoResource,
  poster: PropTypes.string,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  loop: PropTypes.bool,
});

StoryPropTypes.elements.gif = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: ResourcePropTypes.gifResource,
});

StoryPropTypes.elements.media = PropTypes.oneOfType([
  StoryPropTypes.elements.image,
  StoryPropTypes.elements.video,
  StoryPropTypes.elements.gif,
]);

export const AnimationPropType = PropTypes.shape(AnimationProps);

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

const StoryTextElementPropTypes = {
  content: PropTypes.string,
  backgroundTextMode: PropTypes.oneOf(Object.values(BACKGROUND_TEXT_MODE)),
  backgroundColor: PatternPropType,
  font: FontPropType.isRequired,
  fontSize: PropTypes.number,
  lineHeight: PropTypes.number,
  padding: PaddingPropType,
  textAlign: PropTypes.string,
};

StoryPropTypes.textContent = PropTypes.shape({
  ...StoryTextElementPropTypes,
});

StoryPropTypes.elements.text = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryTextElementPropTypes,
});

StoryPropTypes.elements.shape = PropTypes.shape({
  ...StoryElementPropTypes,
  backgroundColor: PatternPropType,
});

StoryPropTypes.elements.sticker = PropTypes.shape({
  ...StoryElementPropTypes,
  sticker: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }),
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
 * @property {Element[]} elements Array of all elements.
 */

/**
 * Element object
 *
 * @typedef {Element} Element A story element
 * @property {string} id  A unique uuid for the element
 * @property {string} type The type of the element, e.g. video, gif, image
 * @property {number} x The x position of the element, its top left corner
 * @property {number} y The y position of the element, its top left corner
 * @property {number} width The width of the element
 * @property {number} height The height of the element
 * @property {Object} flip If the element has been flipped vertical/horizontal
 * @property {number} rotationAngle The element's rotation angle
 * @property {Object} mask The type of mask applied to the element
 * @property {Object} link The url, icon and description of a link applied to element
 * @property {number} opacity The opacity of the element
 * @property {boolean} lockAspectRatio Whether the element's aspect ratio is locked
 * @property {Resource} resource The element's resource object
 */

/**
 * Resource object
 *
 * @typedef {Resource} Resource Resource data for elements
 * @property {{ full: { height: number, width: number }, output: Object }} sizes The data for the full-size element
 * @property {boolean} local Whether the media was uploaded by the user
 * @property {boolean} isOptimized Whether the media was uploaded by the user
 * @property {boolean} isPlaceholder Whether the resource is a placeholder and not fully uploaded yet.
 * @property {string} src The source string for the resource
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
 * @property {Object} author Story author.
 * @property {string} slug The slug of the story.
 * @property {string} date The publish date of the story.
 * @property {string} modified The modified date of the story.
 * @property {string} content AMP HTML content.
 * @property {string} excerpt Short description.
 * @property {Object} featuredMedia Featured media object.
 * @property {string} password Password
 */
