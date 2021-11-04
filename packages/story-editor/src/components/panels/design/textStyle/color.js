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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Color, Row } from '../../../form';
import useRichTextFormatting from './useRichTextFormatting';

function ColorControls({ selectedElements, pushUpdate, textColorRef }) {
  const {
    textInfo: { color },
    handlers: { handleSetColor },
  } = useRichTextFormatting(selectedElements, pushUpdate);

  return (
    <Row>
      <Color
        data-testid="text.color"
        value={color}
        onChange={handleSetColor}
        allowsSavedColors
        label={__('Text color', 'web-stories')}
        labelId="text-color-label"
        changedStyle="color"
        ref={textColorRef}
        hasEyedropper
      />
    </Row>
  );
}

ColorControls.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
  textColorRef: PropTypes.func,
};

export default ColorControls;
