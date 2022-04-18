/*
 * Copyright 2021 Google LLC
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
import {
  TOOLTIP_RTL_PLACEMENT,
  Tooltip as BaseTooltip,
  TooltipPropTypes,
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

export default function Tooltip({
  placement = TOOLTIP_PLACEMENT.BOTTOM,
  ...props
}) {
  const { isRTL, styleConstants: { leftOffset } = {} } = useConfig();
  const derivedPlacement = isRTL ? TOOLTIP_RTL_PLACEMENT[placement] : placement;

  return (
    <BaseTooltip
      placement={derivedPlacement}
      isRTL={isRTL}
      leftOffset={leftOffset}
      //TODO: https://github.com/GoogleForCreators/web-stories-wp/issues/11200
      ignoreMaxOffsetY
      {...props}
    />
  );
}
Tooltip.propTypes = TooltipPropTypes;
