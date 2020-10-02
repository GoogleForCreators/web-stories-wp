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
import getFontFallback from './getFontFallback.js';

//eslint-disable-next-line security/detect-unsafe-regex
const FONT_VARIANT_PATTERN = /(?<weight>\d+)?(?<style>\D+)?/;

/**
 * Raw font object.
 *
 * @typedef {Object} RawFont font object
 * @property {string} family Font family.
 * @property {string} category Font family.
 * @property {Array<string>} variants Font variants.
 * @property {Object<*>} fonts Font URLs.
 */

/**
 * Font object.
 *
 * @typedef {Font} Font Font object.
 * @property {string} family Font family.
 * @property {Array<string>} fallbacks Font fallbacks.
 * @property {Array<number>} weights Font weights.
 * @property {Array<string>} styles Font styles.
 * @property {Array<Array<number, number>>} variants Font variants.
 * @property {string} service Font provider.
 */

/**
 * Normalizes font objects for later use.
 *
 * Drops unnecessary fields, and splits provided variants list
 * into weights, styles, and variants tuples.
 *
 * @param {RawFont} font Font object.
 * @return {Font} Normalized font object.
 */
function normalizeFont(font) {
  const variants = [];
  const weights = [];
  const styles = [];

  const { family, category, variants: initialVariants } = font;

  for (const variant of initialVariants) {
    const found = variant.match(FONT_VARIANT_PATTERN);

    const weight = found.groups.weight || false;

    if (weight) {
      weights.push(Number(weight));
    }

    const style = found.groups.style || false;

    if (style) {
      if ('regular' === style || !weight) {
        weights.push(400);
      }

      styles.push(style);
    }

    // Example: [ 1, 700] for italic+bold.
    const variantTuple = [
      Number('italic' === style),
      weight ? Number(weight) : 400,
    ];

    variants.push(variantTuple);
  }

  return {
    family,
    fallbacks: [getFontFallback(category)],
    weights: [...new Set(weights)],
    styles: [...new Set(styles)],
    variants,
    service: 'fonts.google.com',
  };
}

export default normalizeFont;
