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
 * Internal dependencies
 */
import { ANIMATION_TYPES } from '../constants';
import getFadeConfig from './fade';
import getFlipConfig from './flip';
import getFloatOnConfig from './floatOn';
import getMoveConfig from './move';
import getSpinConfig from './spin';
import getZoomConfig from './zoom';

export default {
  [ANIMATION_TYPES.FADE]: getFadeConfig,
  [ANIMATION_TYPES.FLIP]: getFlipConfig,
  [ANIMATION_TYPES.FLOAT_ON]: getFloatOnConfig,
  [ANIMATION_TYPES.MOVE]: getMoveConfig,
  [ANIMATION_TYPES.SPIN]: getSpinConfig,
  [ANIMATION_TYPES.ZOOM]: getZoomConfig,
};
