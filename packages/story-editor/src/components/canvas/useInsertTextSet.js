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
import { useCallback, useBatchingCallback } from '@googleforcreators/react';
import {
  DANGER_ZONE_HEIGHT,
  FULLBLEED_HEIGHT,
  PAGE_WIDTH,
} from '@googleforcreators/units';
import { getHTMLFormatters } from '@googleforcreators/rich-text';
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import objectWithout from '../../utils/objectWithout';
import { useStory } from '../../app/story';
import { useCalculateAccessibleTextColors } from '../../app/pageCanvas';
import useInsertElement from './useInsertElement';

const SCRIM_PADDING = 24;

function useInsertTextSet(shouldUseSmartColor = false) {
  const insertElement = useInsertElement();
  const calculateAccessibleTextColors = useCalculateAccessibleTextColors();

  const { setSelectedElementsById } = useStory(
    ({ actions: { setSelectedElementsById } }) => {
      return {
        setSelectedElementsById,
      };
    }
  );

  const insertTextSet = useBatchingCallback(
    async (toAdd, applySmartColor = shouldUseSmartColor) => {
      const htmlFormatters = getHTMLFormatters();
      const { setColor } = htmlFormatters;
      const addedElements = [];

      const hasPredefinedColor = toAdd.some((element) =>
        element.content?.includes('color:')
      );

      let textElementsContrasts = [];
      let firstValidColor = null;

      const white = {
        r: 255,
        g: 255,
        b: 255,
      };
      const black = {
        r: 0,
        g: 0,
        b: 0,
      };
      const whiteScrim = {
        ...white,
        a: 0.3,
      };
      const blackScrim = {
        ...black,
        a: 0.3,
      };
      let preferredScrimColor, scrimsCount, useScrim;

      // Insert scrim as a first element if needed.
      if (applySmartColor && !hasPredefinedColor) {
        textElementsContrasts = await Promise.all(
          toAdd.map((element) =>
            element.type === 'text'
              ? calculateAccessibleTextColors(element)
              : null
          )
        );
        firstValidColor = textElementsContrasts.find((c) => c);
        const allColorsEqual = textElementsContrasts.every(
          (contrast) =>
            contrast === null ||
            (contrast.color?.r === firstValidColor.color?.r &&
              contrast.color?.g === firstValidColor.color?.g &&
              contrast.color?.b === firstValidColor.color?.b &&
              contrast.color?.a === firstValidColor.color?.a)
        );
        scrimsCount = textElementsContrasts.reduce(
          (acc, contrast) => (contrast?.backgroundColor ? acc + 1 : acc),
          0
        );
        const blackScrims = textElementsContrasts.reduce(
          (acc, contrast) =>
            contrast?.backgroundColor?.r === 0 &&
            contrast?.backgroundColor?.g === 0 &&
            contrast?.backgroundColor?.b === 0
              ? acc + 1
              : acc,
          0
        );
        preferredScrimColor =
          scrimsCount - blackScrims > 0 ? blackScrim : whiteScrim;

        useScrim = scrimsCount > 0 || allColorsEqual === false;

        if (useScrim) {
          const { textSetHeight, textSetWidth } = toAdd[0];
          const getMinDim = (dim) =>
            Math.min.apply(
              null,
              toAdd.map((e) => e[dim])
            );
          const x = getMinDim('x');
          const y = getMinDim('y');
          const scrim = {
            x: x - SCRIM_PADDING,
            y: y - SCRIM_PADDING,
            width: textSetWidth + SCRIM_PADDING * 2,
            height: textSetHeight + SCRIM_PADDING * 2,
            backgroundColor: {
              color: preferredScrimColor,
            },
            type: 'shape',
          };
          addedElements.push(insertElement(ELEMENT_TYPES.SHAPE, scrim));
        }
      }

      toAdd.forEach((element, index) => {
        const toInsert = objectWithout(element, [
          'id',
          'normalizedOffsetX',
          'normalizedOffsetY',
          'textSetWidth',
          'textSetHeight',
        ]);
        if (applySmartColor && !hasPredefinedColor) {
          // If scrim is used - adjust the colors, otherwise use defaults.
          const scrimContrastingTextColor =
            preferredScrimColor.r === 0 ? white : black;
          const autoColor = useScrim
            ? { color: scrimContrastingTextColor }
            : textElementsContrasts[index];

          // Only apply the colors if a better color was detected.
          if (element.type === 'text' && autoColor.color) {
            toInsert.content = setColor(toInsert.content, autoColor);
          }
          if (element.type === 'shape' && firstValidColor.color) {
            // So far we only use borders (no fill) or shapes with fill (no borders).
            if (element.border) {
              toInsert.border.color = firstValidColor;
            } else {
              toInsert.backgroundColor = firstValidColor;
            }
          }
        }
        addedElements.push(insertElement(element.type, toInsert));
      });
      // Select all added elements.
      setSelectedElementsById({
        elementIds: addedElements.map(({ id }) => id),
      });
    },
    [
      calculateAccessibleTextColors,
      shouldUseSmartColor,
      insertElement,
      setSelectedElementsById,
    ]
  );

  const insertTextSetByOffset = useCallback(
    (elements, { offsetX, offsetY }) => {
      if (!elements.length) {
        return;
      }

      const positionedTextSet = elements
        .map((element) => {
          // Skip adding any elements that are outside of page.
          const x = element.normalizedOffsetX + offsetX;
          const y = element.normalizedOffsetY + offsetY;
          const { width, height } = element;
          if (
            x > PAGE_WIDTH ||
            x + width < 0 ||
            y > FULLBLEED_HEIGHT ||
            y + height < -DANGER_ZONE_HEIGHT
          ) {
            return null;
          }
          return {
            ...element,
            x,
            y,
          };
        })
        .filter((el) => el);

      insertTextSet(positionedTextSet, false /* Skips using smart color */);
    },
    [insertTextSet]
  );

  return { insertTextSet, insertTextSetByOffset };
}

export default useInsertTextSet;
