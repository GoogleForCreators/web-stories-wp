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
import { migrate } from '../../../../../migration/migrate';

async function loadTextSet(name) {
  const data = await import(`./raw/${name}.json`);
  const migrated = migrate(data, data.version);

  const textSets = migrated.pages.reduce((sets, page) => {
    let minX = Infinity;
    let maxX = 0;

    let minY = Infinity;
    let maxY = 0;

    const textElements = page.elements.reduce((acc, element) => {
      if (!element.isBackground) {
        minX = Math.min(minX, element.x);
        maxX = Math.max(maxX, element.x + element.width);

        minY = Math.min(minY, element.y);
        maxY = Math.max(maxY, element.y + element.height);

        return [...acc, element];
      }

      return acc;
    }, []);

    return [
      ...sets,
      textElements.map((e) => ({
        ...e,
        // Offset elements so the text set's
        // default position is (0,0)
        x: e.x - minX,
        y: e.y - minY,
        // The overall text set width & height
        // is the delta between the max/mins
        textSetWidth: maxX - minX,
        textSetHeight: maxY - minY,
      })),
    ];
  }, []);

  return textSets;
}

export default async function loadTextSets() {
  const textSets = ['editorial'];

  const results = await Promise.all(
    textSets.map(async (name) => {
      return [name, await loadTextSet(name)];
    })
  );

  return Object.fromEntries(results);
}
