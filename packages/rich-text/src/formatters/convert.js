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
import { Modifier } from 'draft-js';

/**
 * Internal dependencies
 */
import { ITALIC, UNDERLINE } from '../customConstants';
import { weightToStyle } from './weight';

function convertStyles(contentBlock, blockSelection, contentState) {
  let updatedContentState = contentState;
  let lastMetadata = null;
  contentBlock.findStyleRanges(
    (metadata) => {
      lastMetadata = metadata;
      return true;
    },
    (start, end) => {
      // Get new list of styles for this range
      const oldStyles = lastMetadata.getStyle().toArray();
      const newStyles = getNewStyles(oldStyles);
      // Create a selection for this range
      const rangeSelection = blockSelection.merge({
        anchorOffset: start,
        focusOffset: end,
      });
      // Update content by removing all the old styles and applying all the new styles
      oldStyles.forEach((oldStyle) => {
        updatedContentState = Modifier.removeInlineStyle(
          updatedContentState,
          rangeSelection,
          oldStyle
        );
      });
      newStyles.forEach((newStyle) => {
        updatedContentState = Modifier.applyInlineStyle(
          updatedContentState,
          rangeSelection,
          newStyle
        );
      });
    }
  );
  return updatedContentState;
}

const styleMap = {
  BOLD: weightToStyle('700'),
  ITALIC: ITALIC,
  UNDERLINE: UNDERLINE,
};

function getNewStyles(oldStyles) {
  return oldStyles
    .map((oldStyle) => (oldStyle in styleMap ? styleMap[oldStyle] : null))
    .filter(Boolean);
}

export default convertStyles;
