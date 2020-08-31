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
