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
import type { EditorState } from 'draft-js';
import type { OrderedSet } from 'immutable';

/**
 * Internal dependencies
 */
import {
  FontVariantStyle,
  type FontVariant,
} from '@googleforcreators/elements';
import { ITALIC, WEIGHT } from './customConstants';
import { styleToNumeric } from './formatters/util';
import { getAllStyleSetsInSelection } from './draftUtils';
import { getSelectAllStateFromHTML } from './htmlManipulation';

/**
 * Gets font styles for a characters, considers italic and weight only.
 *
 * @param styles Set of styles.
 * @return Array of found styles for the character.
 */
function getFontStylesForCharacter(styles: OrderedSet<string>): string[] {
  return styles
    .toArray()
    .filter((style) => style === ITALIC || style.startsWith(WEIGHT));
}

/**
 * Gets an array of all found font variants (unique).
 * Font variants are in the format of [italic, weight] where italic is 0 or 1.
 *
 * @param editorState Editor state.
 * @return Array of variants.
 */
function getVariants(editorState: EditorState) {
  const styleSets = getAllStyleSetsInSelection(editorState);
  if (styleSets.length === 0) {
    return getFontStylesForCharacter(editorState.getCurrentInlineStyle());
  }
  const styles = styleSets.map((styleSet) => {
    const [style = ''] = getFontStylesForCharacter(styleSet);

    return style;
  });

  return [...new Set(styles)];
}

export default function getFontVariants(html: string): FontVariant[] {
  const htmlState = getSelectAllStateFromHTML(html);
  const variants: FontVariant[] = getVariants(htmlState).map((variant) => [
    variant.startsWith(ITALIC)
      ? FontVariantStyle.Italic
      : FontVariantStyle.Normal,
    variant.startsWith(WEIGHT) ? styleToNumeric(WEIGHT, variant) : 400,
  ]);

  // Return default variant or the found variants.
  return variants.length > 0 ? variants : [[0, 400]];
}
