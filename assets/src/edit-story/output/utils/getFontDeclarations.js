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
import getGoogleFontURL from '../../utils/getGoogleFontURL';

/**
 * Returns a list of font declarations across all pages in a story.
 *
 * @param {Array<import('../../types').Page>} pages List of pages.
 *
 * @return {Array<string>} Font declarations.
 */
const getFontDeclarations = (pages) => {
  const map = new Map();

  for (const { elements } of pages) {
    const textElements = elements.filter(({ type }) => type === 'text');

    // Prepare font objects for later use.
    for (const { font, fontStyle, fontWeight } of textElements) {
      const { service, family, variants } = font;
      if (!service || service === 'system') {
        continue;
      }

      const serviceMap = map.get(service) || new Map();
      map.set(service, serviceMap);

      // Example: [1, 700] for bold + italic.
      const variant = [Number(fontStyle === 'italic'), fontWeight || 400];

      const fontObj = serviceMap.get(family) || { family, variants: [] };
      const fontObjHasVariant = fontObj.variants.some(
        (val) => val[0] === variant[0] && val[1] === variant[1]
      );

      // @todo: use nearest variant as fallback?
      const isValidVariant =
        variants === undefined ||
        variants.some((val) => val[0] === variant[0] && val[1] === variant[1]);

      // Keeps list unique.
      if (!fontObjHasVariant && isValidVariant) {
        fontObj.variants.push(variant);
      }

      serviceMap.set(family, fontObj);
    }
  }

  const fontDeclarations = [];

  for (const [service, serviceMap] of map.entries()) {
    switch (service) {
      case 'fonts.google.com':
        fontDeclarations.push(
          getGoogleFontURL(Array.from(serviceMap.values()))
        );
        break;
      default:
        break;
    }
  }

  return fontDeclarations;
};

export default getFontDeclarations;
