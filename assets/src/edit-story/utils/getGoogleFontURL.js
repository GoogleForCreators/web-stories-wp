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
 * Given a list of Google fonts, returns a URL to embed them.
 *
 * Uses the given list of font variants (axis tuples) to assemble the
 * axis tag list and axis tuple list that Google Fonts expects.
 *
 * @see https://developers.google.com/fonts/docs/css2
 *
 * @param {Array<Object<string, Array<number, number>>>} fonts List of font objects.
 * @param {string} [display] Valid font-display value, e.g. 'swap' or 'auto'. Default 'swap'.
 * @return {string} Google Fonts embed URL.
 */
function getGoogleFontURL(fonts, display = 'swap') {
  const url = new URL('https://fonts.googleapis.com/css2');
  url.searchParams.append('display', display);

  for (const { family: familyName, variants = [] } of fonts) {
    // [ [ 1, 400 ], [ 0, 700 ] ] -> [ ital, wght ]
    const axes = variants
      .reduce((acc, [fontStyle, fontWeight]) => {
        // Uses axis names as listed on https://developers.google.com/web/fundamentals/design-and-ux/typography/variable-fonts.
        if (fontStyle === 1 && !acc.includes('ital')) {
          acc.push('ital');
        }
        if (fontWeight && fontWeight !== 400 && !acc.includes('wght')) {
          acc.push('wght');
        }
        return acc;
      }, [])
      .sort(); // Need to be sorted alphabetically.

    let family = familyName;

    const axisTagList = axes.join(',');

    // [ ital, wght ] -> Roboto:ital,wght
    if (axisTagList) {
      family += ':' + axisTagList;
    }

    const axisTuples = variants
      .sort((a, b) => {
        if (a[0] < b[0]) {
          return -1;
        }

        if (a[0] > b[0]) {
          return 1;
        }

        return a[1] - b[1];
      })
      .map(([fontStyle, fontWeight]) => {
        const tuple = [];
        if (axes.includes('ital')) {
          tuple.push(fontStyle);
        }
        if (axes.includes('wght')) {
          tuple.push(fontWeight);
        }
        return tuple;
      });

    // [ [ 1, 400 ], [ 0, 700 ] ] -> 1,400;0,700
    const axisTupleList = axisTuples.join(';');

    const onlyRegularVariant = axisTupleList === '400';

    if (axisTupleList && !onlyRegularVariant) {
      family += '@' + axisTupleList;
    }

    url.searchParams.append('family', family);
  }

  return decodeURI(url.toString());
}

export default getGoogleFontURL;
