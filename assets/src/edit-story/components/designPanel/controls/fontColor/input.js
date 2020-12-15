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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Color } from '../../parts/color';
import CONFIG from './config';
import useUpdateFontColor from './useUpdateFontColor';

function FontColorInput() {
  const updateFontColor = useUpdateFontColor();

  return (
    <Color
      property={CONFIG.FONTCOLOR.PROPERTY}
      label={__('Text color', 'web-stories')}
      labelId={CONFIG.FONTCOLOR.ID}
      onChange={updateFontColor}
    />
  );
}

export default FontColorInput;
