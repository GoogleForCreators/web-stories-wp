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
 * Internal dependencies
 */
import { ITALIC, WEIGHT } from './customConstants';
import { styleToNumeric } from './formatters/util';
import { getAllStyleSetsInSelection } from './draftUtils';
import { getSelectAllStateFromHTML } from './htmlManipulation';

function getFontStylesForCharacter(styles) {
  return styles
    .toArray()
    .map((style) => style.style ?? style)
    .filter((style) => style.startsWith(ITALIC) || style.startsWith(WEIGHT));
}

export function getVariantsInSelection(editorState) {
  const styleSets = getAllStyleSetsInSelection(editorState);
  if (styleSets.length === 0) {
    return [getFontStylesForCharacter(editorState.getCurrentInlineStyle())];
  }

  const styles = [];
  const hasStyle = (style) =>
    styles.some((val) => val[0] === style[0] && val[1] === style[1]);
  styleSets.forEach((styleSet) => {
    const styleArray = getFontStylesForCharacter(styleSet);

    if (!hasStyle(styleArray)) {
      styles.push(styleArray);
    }
  });

  return [...styles];
}

export default function getFontVariants(html) {
  const htmlState = getSelectAllStateFromHTML(html);
  return getVariantsInSelection(htmlState)
    .filter((variant) => variant.length)
    .map((variant) => {
      const weight = variant.find((val) => val.startsWith(WEIGHT));
      const italic = variant.find((val) => val.startsWith(ITALIC));
      return [italic ? 1 : 0, weight ? styleToNumeric(WEIGHT, weight) : 400];
    });
}
