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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { FIELD_TYPES, SCALE_DIRECTION } from '../../constants';
import zoomAnimationProps, {
  ZoomEffectInputPropTypes,
} from '../backgroundZoom/animationProps';
import panAnimationProps, {
  PanEffectInputPropTypes,
} from '../backgroundPan/animationProps';

export const PanAndZoomEffectInputPropTypes = {
  ...PanEffectInputPropTypes,
  ...ZoomEffectInputPropTypes,
};

const zoomAnimationPropsWithDropdown = {
  ...zoomAnimationProps,
  zoomDirection: {
    ...zoomAnimationProps.zoomDirection,
    type: FIELD_TYPES.DROPDOWN,
    values: [
      { value: SCALE_DIRECTION.SCALE_IN, name: __('Zoom in', 'web-stories') },
      { value: SCALE_DIRECTION.SCALE_OUT, name: __('Zoom out', 'web-stories') },
    ],
  },
};

export default {
  ...panAnimationProps,
  ...zoomAnimationPropsWithDropdown,
};
