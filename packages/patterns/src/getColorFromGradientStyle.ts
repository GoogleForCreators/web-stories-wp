/*
 * Copyright 2023 Google LLC
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
import { DEFAULT_GRADIENT, GRADIENT, GRADIENT_REGEX } from './constants';
import createSolidFromString from './createSolidFromString';
import { PatternType, type Gradient } from './types';

export default function getColorFromGradientStyle(style: string): Gradient {
  if (style.includes(GRADIENT.LINEAR)) {
    return parseGradient(style, GRADIENT.LINEAR);
  } else if (style.includes(GRADIENT.RADIAL)) {
    return parseGradient(style, GRADIENT.RADIAL);
  }
  throw new Error('Invalid style string passed.');
}

function parseGradient(style: string, gradient: string): Gradient {
  const regex = GRADIENT_REGEX[gradient];
  const matches = style.match(regex);
  if (!matches) {
    return DEFAULT_GRADIENT;
  }

  const { startColor, endColor } = getColorRange(matches);

  if (gradient === GRADIENT.LINEAR) {
    const rotationMatch = style.match(/0(\.((25|5|75)))?turn/);
    return {
      type: PatternType.Linear,
      stops: [
        { color: startColor, position: 0 },
        { color: endColor, position: 1 },
      ],
      rotation: rotationMatch ? Number.parseFloat(rotationMatch[0]) : 0,
    };
  }

  return {
    type: PatternType.Radial,
    stops: [
      { color: startColor, position: 0 },
      { color: endColor, position: 1 },
    ],
  };
}

function getColorRange(matches: RegExpMatchArray) {
  const [
    ,
    startColorR,
    startColorG,
    startColorB,
    startAlpha,
    startHex,
    endColorR,
    endColorG,
    endColorB,
    endAlpha,
    endHex,
  ] = matches;

  const startColor = startHex
    ? createSolidFromString(`#${startHex}`).color
    : parseColor(startColorR, startColorG, startColorB, startAlpha);

  const endColor = endHex
    ? createSolidFromString(`#${endHex}`).color
    : parseColor(endColorR, endColorG, endColorB, endAlpha);

  return { startColor, endColor };
}

function parseColor(r: string, g: string, b: string, a: string) {
  return {
    r: Number.parseInt(r),
    g: Number.parseInt(g),
    b: Number.parseInt(b),
    a: a ? Number.parseFloat(a) : undefined,
  };
}
