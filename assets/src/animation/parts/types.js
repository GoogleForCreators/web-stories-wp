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
import {
  ANIMATION_TYPES,
  ANIMATION_EFFECTS,
  BACKGROUND_ANIMATION_EFFECTS,
} from '../constants';
import { GeneralAnimationPropTypes } from '../outputs/types';

export const WAAPIAnimationProps = {
  children: PropTypes.node.isRequired,
  hoistAnimation: PropTypes.func,
};

export const AMPAnimationProps = {
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  prefixId: PropTypes.string,
};

export const AnimationProps = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    ...Object.values(ANIMATION_TYPES),
    ...Object.values(ANIMATION_EFFECTS).map((o) => o.value),
    ...Object.values(BACKGROUND_ANIMATION_EFFECTS).map((o) => o.value),
  ]),
  targets: PropTypes.arrayOf(PropTypes.string),
  ...GeneralAnimationPropTypes,
};
