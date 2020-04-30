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

export const isStyle = (style, prefix) =>
  typeof style === 'string' && style.startsWith(prefix);

export const getVariable = (style, prefix) => style.slice(prefix.length + 1);

/*
 * Numerics use PREFIX-123 for the number 123
 * and PREFIX-N123 for the number -123.
 */
export const numericToStyle = (prefix, num) =>
  `${prefix}-${num < 0 ? 'N' : ''}${Math.abs(num)}`;

export const styleToNumeric = (prefix, style) => {
  const raw = getVariable(style, prefix);
  // Negative numbers are prefixed with an N:
  if (raw.charAt(0) === 'N') {
    return -parseInt(raw.slice(1));
  }
  return parseInt(raw);
};
