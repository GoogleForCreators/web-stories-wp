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
import type { Element } from '@googleforcreators/types';

type stringable = string | number | boolean | null | undefined;

/**
 * Just the functional equivalent of your baseline template literal.
 *
 * ```js
 * const args = ['am', 'dog'];
 * literal(['I ', ' a '], ...args)  === `I ${args[0]} a ${args[1]}`; // true
 * ```
 *
 * @param strings strings in template tag
 * @param args arguments in template tag
 * @return string result
 */
export function literal(strings: string[], ...args: stringable[]): string {
  return strings
    .reduce<stringable[]>((accum, str, i) => accum.concat([str, args[i]]), [])
    .join('');
}

/**
 * @typedef TemplateTag
 * @param {Array<string>} strings strings in template tag
 * @param {Array<any>} args arguments in template tag
 * @return {string} string result
 */

/**
 * Given an element, this function returns a template tag
 * that wraps any given string in a counter transform to reset the
 * global coordinate space, then reapplies the original element
 * transform to retain visual consistency.
 *
 * ```js
 * const glabal = getGlobalSpace(element);
 * const keyframes = [
 *   transform: global`translate3d(0, ${pageHeightInElementPercent}%, 0)`,
 *   transform: 'none'
 * ];
 * ```
 *
 * @param element story element to derive counter transforms off of.
 * @return template string tag that resets transform space.
 */
export function getGlobalSpace(element: Element = {}) {
  function global(...template: stringable[]) {
    return `rotate(${-1 * element?.rotationAngle}deg) ${literal(
      ...template
    )} rotate(${element?.rotationAngle}deg)`;
  }
  return element?.rotationAngle ? global : literal;
}
