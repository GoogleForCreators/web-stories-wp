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
import { OverlayType } from '@googleforcreators/design-system';

function convertToSolid(currentOverlay, currentType) {
  switch (currentType) {
    case OverlayType.NONE:
      // default color
      return {
        color: { r: 0, g: 0, b: 0, a: 0.5 },
      };

    case OverlayType.LINEAR:
    case OverlayType.RADIAL: {
      // converting from any gradient to SOLID
      // use "opaque'st" stop as primary color, but fix alpha at .3
      const { stops } = currentOverlay;
      const stopsByAlpha = stops.sort(
        (x, y) => (y.color.a ?? 1) - (x.color.a ?? 1)
      );
      const {
        color: { r, g, b },
      } = stopsByAlpha[0];
      return {
        color: { r, g, b, a: 0.5 },
      };
    }

    default:
      return currentOverlay;
  }
}
function convertToLinear(currentOverlay, currentType) {
  switch (currentType) {
    case OverlayType.NONE:
      // default pattern
      return {
        type: 'linear',
        rotation: 0,
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.7,
      };

    case OverlayType.SOLID: {
      // converting from SOLID to RADIAL
      const {
        color: { r, g, b, a },
      } = currentOverlay;
      return {
        type: 'linear',
        rotation: 0,
        stops: [
          { color: { r, g, b, a: 0 }, position: 0.4 },
          { color: { r, g, b, a: 1 }, position: 1 },
        ],
        alpha: a,
      };
    }

    case OverlayType.RADIAL: {
      // converting from LINEAR to RADIAL
      const { stops, alpha } = currentOverlay;
      return {
        type: 'linear',
        rotation: 0,
        stops,
        alpha,
      };
    }

    default:
      return currentOverlay;
  }
}
function convertToRadial(currentOverlay, currentType) {
  switch (currentType) {
    case OverlayType.NONE:
      // default pattern
      return {
        type: 'radial',
        size: { w: 0.67, h: 0.67 },
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.7,
      };

    case OverlayType.SOLID: {
      // converting from SOLID to RADIAL
      const {
        color: { r, g, b, a },
      } = currentOverlay;
      return {
        type: 'radial',
        size: { w: 0.67, h: 0.67 },
        stops: [
          { color: { r, g, b, a: 0 }, position: 0 },
          { color: { r, g, b, a: 1 }, position: 1 },
        ],
        alpha: a,
      };
    }

    case OverlayType.LINEAR: {
      // converting from LINEAR to RADIAL
      const { stops, alpha } = currentOverlay;
      return {
        type: 'radial',
        size: { w: 0.67, h: 0.67 },
        stops,
        alpha,
      };
    }

    default:
      return currentOverlay;
  }
}

function convertOverlay(currentOverlay, currentType, newType) {
  switch (newType) {
    case OverlayType.NONE:
      return null;

    case OverlayType.SOLID:
      return convertToSolid(currentOverlay, currentType);

    case OverlayType.LINEAR:
      return convertToLinear(currentOverlay, currentType);

    case OverlayType.RADIAL:
      return convertToRadial(currentOverlay, currentType);

    default:
      return currentOverlay;
  }
}

export default convertOverlay;
