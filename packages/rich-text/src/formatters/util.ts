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
import type { FontWeight, FontVariantStyle } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { type LETTERSPACING, WEIGHT } from '../customConstants';

export const isStyle = (style: string | undefined, prefix: string) =>
  Boolean(style?.startsWith(prefix));

export const getVariable = (style: string, prefix: string) =>
  style.slice(prefix.length + 1);

/*
 * Numerics use PREFIX-123 for the number 123
 * and PREFIX-N123 for the number -123.
 */
export const numericToStyle = (prefix: string, num: number) =>
  `${prefix}-${num < 0 ? 'N' : ''}${Math.abs(num)}`;

export function styleToNumeric(
  prefix: typeof LETTERSPACING,
  style: string
): number;
export function styleToNumeric(
  prefix: typeof WEIGHT,
  style: string
): FontWeight;
export function styleToNumeric(
  prefix: string,
  style: string
): FontWeight | FontVariantStyle {
  const raw = getVariable(style, prefix);
  // Negative numbers are prefixed with an N:
  if (raw.charAt(0) === 'N') {
    return -Number.parseInt(raw.slice(1));
  }
  return Number.parseInt(raw);
}

export function weightToStyle(weight: number) {
  return numericToStyle(WEIGHT, weight);
}
