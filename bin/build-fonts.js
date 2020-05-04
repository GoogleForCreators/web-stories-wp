#!/usr/bin/env node
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
import SYSTEM_FONTS from './systemFonts';

const { readFileSync, writeFileSync, existsSync } = require('fs');
const process = require('process');

const PLUGIN_DIR = process.cwd();
const FONTS_FILE = PLUGIN_DIR + '/includes/data/fonts.json';

if (!existsSync(FONTS_FILE)) {
  process.exit(1);
}

const rawData = readFileSync(FONTS_FILE);
const googleFonts = JSON.parse(rawData);

const fonts = [...SYSTEM_FONTS];

const FONT_VARIANT_PATTERN = /(?<weight>\d+)?(?<style>\D+)?/;

/**
 * Returns a valid CSS font fallback declaration for a Google font.
 *
 * @param {string} category Font category.
 * @return {string} Font fallback.
 */
function getFontFallback(category) {
  switch (category) {
    case 'handwriting':
    case 'display':
      return 'cursive';
    case 'sans-serif':
    case 'monospace':
      return category;
    default:
      return 'serif';
  }
}

for (const font of googleFonts) {
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

    const hasVariant = variants.some(
      (val) => val[0] === variantTuple[0] && val[1] === variantTuple[1]
    );

    if (!hasVariant) {
      variants.push(variantTuple);
    }
  }

  fonts.push({
    family,
    fallbacks: [getFontFallback(category)],
    weights: [...new Set(weights)],
    styles: [...new Set(styles)],
    variants,
    service: 'fonts.google.com',
  });
}

fonts.sort((a, b) => a.family.localeCompare(b.family));

writeFileSync(FONTS_FILE, JSON.stringify(fonts));

process.exit(0);
