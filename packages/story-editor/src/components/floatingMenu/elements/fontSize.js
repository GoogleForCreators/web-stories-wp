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
import { __ } from '@googleforcreators/i18n';
import { NumericInput } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../constants';
import {
  focusStyle,
  getCommonValue,
  inputContainerStyleOverride,
} from '../../panels/shared';
import { MIN_MAX } from '../../panels/design/textStyle/font';

function FontSize() {
  const { selectedElements, updateSelectedElements } = useStory(
    ({ state: { selectedElements }, actions: { updateSelectedElements } }) => {
      return {
        selectedElements,
        updateSelectedElements,
      };
    }
  );

  const fontSize = getCommonValue(selectedElements, 'fontSize');

  const handleChange = (value) =>
    updateSelectedElements({
      properties: {
        fontSize: value,
      },
    });
  return (
    <NumericInput
      aria-label={__('Font size', 'web-stories')}
      isFloat
      value={fontSize}
      onChange={(evt, value) => handleChange(value)}
      min={MIN_MAX.FONT_SIZE.MIN}
      max={MIN_MAX.FONT_SIZE.MAX}
      isIndeterminate={MULTIPLE_VALUE === fontSize}
      placeholder={MULTIPLE_VALUE === fontSize ? MULTIPLE_DISPLAY_VALUE : null}
      containerStyleOverride={inputContainerStyleOverride}
      selectButtonStylesOverride={focusStyle}
    />
  );
}

export default FontSize;
