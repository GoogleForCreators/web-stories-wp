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
import {
  dataToEditorX,
  dataToEditorY,
  dataToFontSizeY as dataToFontSize,
} from '@googleforcreators/units';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */

import TextOutputWithUnits from './outputWithUnits';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function TextOutput({ element }) {
  const { width } = element;
  return (
    <TextOutputWithUnits
      element={element}
      className="fill"
      dataToStyleX={(x) => `${dataToEditorX(x, 100)}%`}
      dataToStyleY={(y) => `${dataToEditorY(y, 100)}%`}
      dataToFontSizeY={(y) => `${dataToFontSize(y, 100)}em`}
      // Both vertical and horizontal paddings are calculated in % relative to
      // the box's width per CSS rules.
      dataToPaddingX={(x) => `${(x / width) * 100}%`}
      dataToPaddingY={(y) => `${(y / width) * 100}%`}
    />
  );
}

TextOutput.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
};

export default TextOutput;
