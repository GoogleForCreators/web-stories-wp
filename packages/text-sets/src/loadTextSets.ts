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
import { migrate } from '@googleforcreators/migration';
import type { Element } from '@googleforcreators/elements';
import { ElementType } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import type { MinMax, TextSet, TextSetData, TextSets } from './types';
import { TextSetType } from './types';

function updateMinMax(minMax: MinMax, element: Element): MinMax {
  // Purposely mutating object so passed
  // in minMax is modified
  minMax.minX = Math.min(minMax.minX, element.x);
  minMax.maxX = Math.max(minMax.maxX, element.x + element.width);

  minMax.minY = Math.min(minMax.minY, element.y);
  minMax.maxY = Math.max(minMax.maxY, element.y + element.height);

  return minMax;
}

async function loadTextSet(name: string) {
  const data: TextSetData = (await import(
    /* webpackChunkName: "chunk-web-stories-textset-[index]" */ `./raw/${name}.json`
  )) as TextSetData;
  const migrated = migrate(data, data.version) as TextSetData;
  return migrated.pages.reduce((sets: TextSet[], page) => {
    const minMax = {
      minX: Infinity,
      maxX: 0,
      minY: Infinity,
      maxY: 0,
    };

    const textElements = page.elements.filter(
      ({ type }) => type === ElementType.Text
    );
    textElements.forEach((element) => updateMinMax(minMax, element));

    return [
      ...sets,
      {
        textSetFonts: page.fonts,
        id: page.id,
        textSetCategory: name,
        elements: textElements.map((e) => ({
          ...e,
          // Offset elements so the text set's
          // default position is (0,0)
          normalizedOffsetX: e.x - minMax.minX,
          normalizedOffsetY: e.y - minMax.minY,
          // The overall text set width & height
          // is the delta between the max/mins
          textSetWidth: minMax.maxX - minMax.minX,
          textSetHeight: minMax.maxY - minMax.minY,
        })),
      },
    ];
  }, []);
}

export default async function loadTextSets() {
  const textSets: TextSets = {} as TextSets;

  await Promise.all(
    Object.values(TextSetType).map(async (name) => {
      textSets[name] = await loadTextSet(name);
    })
  );

  return textSets;
}
