/*
 * Copyright 2021 Google LLC
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
import { getGoogleFontURL, getFontCSS } from '@googleforcreators/fonts';
import { getFontVariants } from '@googleforcreators/rich-text';
import type {
  Story,
  TextElement,
  Font,
  FontVariant,
} from '@googleforcreators/types';

const hasTuple = (tuples: FontVariant[], tuple: FontVariant): boolean =>
  tuples.some((val: FontVariant) => val[0] === tuple[0] && val[1] === tuple[1]);

const tupleDiff = (a: FontVariant, b: FontVariant): number => {
  return Math.abs(a[0] + a[1] - b[0] - b[1]);
};

const getNearestTuple = (
  tuples: FontVariant[],
  tuple: FontVariant
): FontVariant => {
  return tuples.reduce((acc: FontVariant, curr: FontVariant) => {
    const currDiff = tupleDiff(curr, tuple);
    const accDiff = tupleDiff(acc, tuple);

    return currDiff < accDiff ? curr : acc;
  });
};

function FontDeclarations({ pages }: Pick<Story, 'pages'>) {
  const map = new Map() as Map<string, Map<string, Font>>;

  for (const { elements } of pages) {
    const elementsAsTextElements = elements as TextElement[];
    const textElements = elementsAsTextElements.filter(
      ({ type }: TextElement) => type === 'text'
    );
    // Prepare font objects for later use.
    for (const { font, content } of textElements) {
      const { service, family, variants = [], url } = font;
      if (!service || service === 'system') {
        continue;
      }

      const serviceMap: Map<string, Font> = (map.get(service) ||
        new Map()) as Map<string, Font>;
      map.set(service, serviceMap);

      const fontObj: Font = serviceMap.get(family) || {
        family,
        variants: [],
        url,
      };

      const contentVariants = getFontVariants(content);

      if (variants.length > 0) {
        // A variant ("axis tuple" in Google Fonts terms) is a combination
        // of font style and weight for a given font.
        // The first item is a flag for italic.
        // The second item is the numeric font weight.
        // Example: [1, 700] for italic + bold
        for (const variant of contentVariants) {
          // Use closest variant as fallback and let browser do the math if needed.
          // Examples:
          // - If only [ [ 0, 200 ], [ 0, 400 ] ] exist, and
          //   [ 1, 200] was requested, fall back to [ 0, 200 ].
          // - If only [ [ 0, 400 ], [ 0, 800 ] ] exist, and
          //   [ 1, 800] was requested, fall back to [ 0, 800 ].
          // - If only [ [ 1, 400 ] ] exist, and
          //   [ 0, 400] was requested, fall back to [ 1, 400 ].

          const newVariant = getNearestTuple(variants, variant as FontVariant);
          const fontObjHasVariant =
            fontObj.variants && hasTuple(fontObj.variants, newVariant);
          const isValidVariant = hasTuple(variants, newVariant);

          // Keeps list unique.
          if (!fontObjHasVariant && isValidVariant && fontObj.variants) {
            fontObj.variants.push(newVariant);
          }
        }
      }

      serviceMap.set(family, fontObj);
    }
  }

  return (
    <>
      {Array.from(map.keys()).map((service: string) => {
        const serviceMap: Map<string, Font> = map.get(service) as Map<
          string,
          Font
        >;
        switch (service) {
          case 'fonts.google.com':
            return (
              serviceMap && (
                <link
                  key={service}
                  href={getGoogleFontURL(Array.from(serviceMap.values()))}
                  rel="stylesheet"
                />
              )
            );
          case 'custom':
            return (
              serviceMap &&
              Array.from(serviceMap.values()).map(({ family, url }: Font) => {
                const inlineStyle: string = getFontCSS(
                  family,
                  url as string
                ) as string;
                return (
                  <style
                    key={family}
                    dangerouslySetInnerHTML={{
                      __html: inlineStyle,
                    }}
                  />
                );
              })
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default FontDeclarations;
