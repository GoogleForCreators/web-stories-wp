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
/* eslint-disable no-restricted-imports -- Still used by other packages. */
import PropTypes, { type ValidationMap } from 'prop-types';
/* eslint-enable no-restricted-imports -- Still used by other packages. */
import { PatternPropType } from '@googleforcreators/patterns';
import {
  BackgroundAudioPropType,
  ResourcePropTypes,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import {
  MULTIPLE_VALUE,
  BACKGROUND_TEXT_MODE,
  OverlayType,
} from '../constants';

const mask = PropTypes.shape({
  type: PropTypes.string.isRequired,
});

const link = PropTypes.shape({
  url: PropTypes.string.isRequired,
  desc: PropTypes.string,
  needsProxy: PropTypes.bool,
  icon: PropTypes.string,
  rel: PropTypes.arrayOf(PropTypes.string),
});

const box = PropTypes.exact({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  rotationAngle: PropTypes.number.isRequired,
});

const flip = PropTypes.shape({
  vertical: PropTypes.bool,
  horizontal: PropTypes.bool,
});

const StoryElementPropTypes: ValidationMap<unknown> = {
  id: PropTypes.string.isRequired,
  groupId: PropTypes.string,
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  flip,
  rotationAngle: PropTypes.number.isRequired,
  mask,
  link,
  opacity: PropTypes.number,
  lockAspectRatio: PropTypes.bool,
  isBackground: PropTypes.bool,
};

const element = PropTypes.shape(StoryElementPropTypes);

const page = PropTypes.shape({
  id: PropTypes.string.isRequired,
  // Temporary solution for animations. Better would be to move this
  // prop type to the types package, but really?
  animations: PropTypes.arrayOf(PropTypes.object),
  elements: PropTypes.arrayOf(element),
  overlay: PropTypes.oneOf(Object.values(OverlayType)),
  backgroundAudio: PropTypes.shape({
    resource: BackgroundAudioPropType,
    loop: PropTypes.bool,
    tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  }),
});

const StoryLayerPropTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const StoryMediaPropTypes = {
  scale: PropTypes.number.isRequired,
  focalX: PropTypes.number,
  focalY: PropTypes.number,
};

const layer = PropTypes.shape(StoryLayerPropTypes);

const image = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: ResourcePropTypes.imageResource,
});

const video = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: ResourcePropTypes.videoResource,
  poster: PropTypes.string,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  loop: PropTypes.bool,
  volume: PropTypes.number,
});

const gif = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryMediaPropTypes,
  resource: ResourcePropTypes.gifResource,
});

const media = PropTypes.oneOfType([image, video, gif]);

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
  tagName: PropTypes.oneOf(['h1', 'h2', 'h3', 'p', 'auto']),
};

const textContent = PropTypes.shape({
  ...StoryTextElementPropTypes,
});

const text = PropTypes.shape({
  ...StoryElementPropTypes,
  ...StoryTextElementPropTypes,
});

const shape = PropTypes.shape({
  ...StoryElementPropTypes,
  backgroundColor: PatternPropType,
});

const sticker = PropTypes.shape({
  ...StoryElementPropTypes,
  sticker: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }),
});

const background = PropTypes.shape({
  ...StoryLayerPropTypes,
  inner: element,
});

const StoryPropTypes = {
  mask,
  link,
  box,
  page,
  flip,
  element,
  layer,
  textContent,
  elements: { image, video, gif, media, text, shape, sticker, background },
};

export { StoryPropTypes };
