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

function updateMinMax(minMax, element) {
  // Purposely mutating object so passed
  // in minMax is modified
  minMax.minX = Math.min(minMax.minX, element.x);
  minMax.maxX = Math.max(minMax.maxX, element.x + element.width);

  minMax.minY = Math.min(minMax.minY, element.y);
  minMax.maxY = Math.max(minMax.maxY, element.y + element.height);

  return minMax;
}

async function loadTextSet(name) {
  const data = await import(
    /* webpackChunkName: "chunk-web-stories-textset-[index]" */ `./raw/${name}.json`
  );
  const migrated = migrate(data.default, data.default.version);

  return migrated.pages.reduce((sets, page) => {
    const minMax = {
      minX: Infinity,
      maxX: 0,
      minY: Infinity,
      maxY: 0,
    };

    const textElements = page.elements.filter((element) => {
      return !element.isBackground && Boolean(updateMinMax(minMax, element));
    });

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
  const textSets = [
    'cover',
    'step',
    'section_header',
    'editorial',
    'contact',
    'table',
    'list',
    'quote',
  ];

  const results = await Promise.all(
    textSets.map(async (name) => {
      return [name, await loadTextSet(name)];
    })
  );

  return Object.fromEntries(results);
}
