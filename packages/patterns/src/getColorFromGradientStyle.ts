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
import createSolidFromString from './createSolidFromString';
import { PatternType, type Gradient, type Linear } from './types';

const DEFAULT_GRADIENT: Linear = {
  type: PatternType.Linear,
  stops: [
    {
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
      position: 0,
    },
    {
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
      position: 1,
    },
  ],
};

const GRADIENT = {
  LINEAR: 'linear-gradient',
  RADIAL: 'radial-gradient',
};

const REGEX = {
  [GRADIENT.LINEAR]:
    /linear-gradient\((?:-?\d*\.?\d+turn,\s*)?(?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*0%,\s*(?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*100%\)/,
  [GRADIENT.RADIAL]:
    /radial-gradient\((?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*0%,\s*(?:rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*(\d*\.?\d+)?\)|#([0-9a-fA-F]{6}))\s*100%\)/,
};

export default function getColorFromGradientStyle(style: string): Gradient {
  if (style.includes(GRADIENT.LINEAR)) {
    return parseGradient(style, GRADIENT.LINEAR);
  }
  return parseGradient(style, GRADIENT.RADIAL);
}

function parseGradient(style: string, gradient: string): Gradient {
  const regex = REGEX[gradient];
  const matches = style.match(regex);
  if (!matches) {
    return DEFAULT_GRADIENT;
  }

  const { startColor, endColor } = getColorRange(matches);

  if (gradient === GRADIENT.LINEAR) {
    const rotationMatch = style.match(/-?\d+(\.\d+)?turn/);
    return {
      type: PatternType.Linear,
      stops: [
        { color: startColor, position: 0 },
        { color: endColor, position: 1 },
      ],
      rotation: rotationMatch ? parseFloat(rotationMatch[0]) : 0,
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
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b),
    a: a ? parseFloat(a) : undefined,
  };
}
