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

function convertOverlayPattern({ pages, ...rest }) {
  return {
    pages: pages.map(convertPage),
    ...rest,
  };
}

function convertPage({ elements, backgroundOverlay, ...rest }) {
  const hasNonTrivialOverlay =
    backgroundOverlay &&
    ['solid', 'linear', 'radial'].includes(backgroundOverlay);
  const backgroundElement = elements[0];
  const isValidBackgroundElement = ['image', 'video'].includes(
    backgroundElement?.type
  );
  if (!hasNonTrivialOverlay || !isValidBackgroundElement) {
    return {
      elements,
      ...rest,
    };
  }

  return {
    elements: [
      {
        ...backgroundElement,
        backgroundOverlay: getBackgroundOverlay(backgroundOverlay),
      },
      ...elements.slice(1),
    ],
    ...rest,
  };
}

function getBackgroundOverlay(overlayType) {
  switch (overlayType) {
    case 'solid':
      return {
        color: { r: 0, g: 0, b: 0, a: 0.3 },
      };

    case 'linear':
      return {
        type: 'linear',
        rotation: 0,
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.4 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.9,
      };

    case 'radial':
      return {
        type: 'radial',
        size: { w: 0.8, h: 0.5 },
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.25 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.6,
      };

    default:
      return null;
  }
}

export default convertOverlayPattern;
