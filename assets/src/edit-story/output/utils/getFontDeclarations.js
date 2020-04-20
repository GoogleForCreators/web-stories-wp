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
import getGoogleFontURL from './getGoogleFontURL';

/**
 * Returns a list of font declarations across all pages in a story.
 *
 * @param {import('../../types').Page[]} pages List of pages.
 *
 * @return {string[]} Font declarations.
 */
const getFontDeclarations = (pages) => {
  const map = new Map();

  for (const { elements } of pages) {
    const textElements = elements.filter(({ type }) => type === 'text');

    // Prepare font objects for later use.
    for (const { font, fontStyle, fontWeight } of textElements) {
      const { service, family } = font;
      if (!service || service === 'system') {
        continue;
      }

      const serviceMap = map.get(service) || new Map();
      map.set(service, serviceMap);

      const variant = [fontStyle === 'italic' ? 1 : 0, fontWeight];
      const fontObj = serviceMap.get(family) || { family, variants: [variant] };
      fontObj.variants = [...new Set([...fontObj.variants, variant])];
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
