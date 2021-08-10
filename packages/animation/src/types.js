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
import { FlyInEffectInputPropTypes } from './effects/flyIn/animationProps';
import { PanEffectInputPropTypes } from './effects/pan/animationProps';
import { PulseEffectInputPropTypes } from './effects/pulse/animationProps';
import { RotateInEffectInputPropTypes } from './effects/rotateIn/animationProps';
import { WhooshInEffectInputPropTypes } from './effects/whooshIn/animationProps';
import { ZoomEffectInputPropTypes } from './effects/zoom/animationProps';
import { BasicAnimationInputPropTypes } from './parts/defaultAnimationProps';

export const AnimationFormPropTypes = PropTypes.shape({
  ...FlyInEffectInputPropTypes,
  ...PanEffectInputPropTypes,
  ...PulseEffectInputPropTypes,
  ...RotateInEffectInputPropTypes,
  ...WhooshInEffectInputPropTypes,
  ...ZoomEffectInputPropTypes,
  ...BasicAnimationInputPropTypes,
});

// TODO, load this from original source, once made into a package.
export const StoryElementPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  flip: PropTypes.shape({
    vertical: PropTypes.bool,
    horizontal: PropTypes.bool,
  }),
  rotationAngle: PropTypes.number.isRequired,
  mask: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }),
  link: PropTypes.shape({
    url: PropTypes.string.isRequired,
    desc: PropTypes.string,
    icon: PropTypes.string,
  }),
  opacity: PropTypes.number,
  lockAspectRatio: PropTypes.bool,
});

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
 * @property {Object} resource The element's resource object
 */
