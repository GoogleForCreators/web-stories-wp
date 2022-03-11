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
import { useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __, _x } from '@googleforcreators/i18n';
import { Icons, NumericInput } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { getCommonValue, inputContainerStyleOverride } from '../../shared';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';

export const MIN_MAX = {
  OPACITY: {
    MIN: 0,
    MAX: 100,
  },
};

function defaultOpacity({ opacity }) {
  return typeof opacity !== 'undefined' ? opacity : MIN_MAX.OPACITY.MAX;
}

function OpacityControls({ selectedElements, pushUpdate }) {
  const opacity = getCommonValue(selectedElements, defaultOpacity);

  const handleChange = useCallback(
    (evt, value) => pushUpdate({ opacity: value ?? 100 }, true),
    [pushUpdate]
  );

  return (
    <NumericInput
      suffix={<Icons.ColorDrop />}
      unit={_x('%', 'Percentage', 'web-stories')}
      value={opacity}
      onChange={handleChange}
      min={MIN_MAX.OPACITY.MIN}
      max={MIN_MAX.OPACITY.MAX}
      aria-label={__('Opacity in percent', 'web-stories')}
      placeholder={opacity === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''}
      isIndeterminate={opacity === MULTIPLE_VALUE}
      containerStyleOverride={inputContainerStyleOverride}
    />
  );
}

OpacityControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default OpacityControls;
