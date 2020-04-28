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

const { readFileSync, writeFileSync, existsSync } = require('fs');

const PLUGIN_DIR = process.cwd();
const FONTS_FILE = PLUGIN_DIR + '/includes/data/fonts.json';

if (!existsSync(FONTS_FILE)) {
  process.exit(1);
}

const rawData = readFileSync(FONTS_FILE);
const googleFonts = JSON.parse(rawData);

const DEFAULT_WEIGHTS = [400, 700];
const DEFAULT_STYLES = ['italic', 'regular'];

// Default system fonts.
const SYSTEM_FONTS = [
  {
    family: 'Arial',
    fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Arial Black',
    fallbacks: ['Arial Black', 'Arial Bold', 'Gadget', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Arial Narrow',
    fallbacks: ['Arial', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Baskerville',
    fallbacks: [
      'Baskerville Old Face',
      'Hoefler Text',
      'Garamond',
      'Times New Roman',
      'serif',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Brush Script MT',
    fallbacks: ['cursive'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Copperplate',
    fallbacks: ['Copperplate Gothic Light', 'fantasy'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Courier New',
    fallbacks: [
      'Courier',
      'Lucida Sans Typewriter',
      'Lucida Typewriter',
      'monospace',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Century Gothic',
    fallbacks: ['CenturyGothic', 'AppleGothic', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Garamond',
    fallbacks: [
      'Baskerville',
      'Baskerville Old Face',
      'Hoefler Text',
      'Times New Roman',
      'serif',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Georgia',
    fallbacks: ['Times', 'Times New Roman', 'serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Gill Sans',
    fallbacks: ['Gill Sans MT', 'Calibri', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Lucida Bright',
    fallbacks: ['Georgia', 'serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Lucida Sans Typewriter',
    fallbacks: [
      'Lucida Console',
      'monaco',
      'Bitstream Vera Sans Mono',
      'monospace',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Palatino',
    fallbacks: [
      'Palatino Linotype',
      'Palatino LT STD',
      'Book Antiqua',
      'Georgia',
      'serif',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Papyrus',
    fallbacks: ['fantasy'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Tahoma',
    fallbacks: ['Verdana', 'Segoe', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Times New Roman',
    fallbacks: ['Times New Roman', 'Times', 'Baskerville', 'Georgia', 'serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Trebuchet MS',
    fallbacks: [
      'Lucida Grande',
      'Lucida Sans Unicode',
      'Lucida Sans',
      'Tahoma',
      'sans-serif',
    ],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
  {
    family: 'Verdana',
    fallbacks: ['Geneva', 'sans-serif'],
    weights: DEFAULT_WEIGHTS,
    styles: DEFAULT_STYLES,
    service: 'system',
  },
];

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
    case 'sans-serif':
      return 'sans-serif';
    case 'handwriting':
    case 'display':
      return 'cursive';
    case 'monospace':
      return 'monospace';
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

fonts.sort((a, b) => {
  if (a.family > b.family) {
    return 1;
  }
  if (a.family < b.family) {
    return -1;
  }
  return 0;
});

writeFileSync(FONTS_FILE, JSON.stringify(fonts));
