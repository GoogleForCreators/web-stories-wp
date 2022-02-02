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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  canSupportMultiBorder,
  canMaskHaveBorder,
} from '@googleforcreators/masks';

/**
 * Internal dependencies
 */

import { Color, Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { useCommonObjectValue } from '../../shared';
import { DEFAULT_BORDER } from './shared';
import WidthControls from './borderWidth';

function BorderStylePanel(props) {
  const { selectedElements, pushUpdate } = props;
  const border = useCommonObjectValue(
    selectedElements,
    'border',
    DEFAULT_BORDER
  );
  const { color, left, top, right, bottom } = border;

  const allSupportBorder = selectedElements.every((el) =>
    canMaskHaveBorder(el)
  );

  const handleChange = useCallback(
    (value, name) =>
      pushUpdate(
        {
          border: {
            ...border,
            [name]: value,
          },
        },
        true
      ),
    [border, pushUpdate]
  );

  // If any of the elements doesn't support border, don't display.
  if (!allSupportBorder) {
    return null;
  }

  // Some shapes i.e all non-rectangular shapes only support a single border width value
  // If so, they also don't support opacity for the border color, so that has to be removed here
  const hasMultiBorderSupport = selectedElements.every(canSupportMultiBorder);

  const hasBorder = [left, top, right, bottom].some((value) => value > 0);
  return (
    <SimplePanel name="borderStyle" title={__('Border', 'web-stories')}>
      <WidthControls {...props} />
      {hasBorder && (
        <Row>
          <Color
            value={color}
            onChange={(value) => {
              handleChange(value, 'color');
            }}
            label={__('Border color', 'web-stories')}
            changedStyle="border-color"
            hasEyedropper
            allowsOpacity={hasMultiBorderSupport}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

BorderStylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default BorderStylePanel;
